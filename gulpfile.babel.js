'use strict';

import gulp from 'gulp';
import browserify from 'browserify';
import babel from 'babelify';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import del from 'del';
import assign from 'lodash.assign';
import watchify from 'watchify';
import es from 'event-stream';
import flatten from 'gulp-flatten';

import postcss from 'gulp-postcss';
import postcssPartial from 'postcss-partial-import';
import postcssNested from 'postcss-nested';
import postcssSimpleVars from 'postcss-simple-vars';
import postcssCalc from 'postcss-calc';
import postcssPropertyLookup from 'postcss-property-lookup';
import postcssColorFunction from 'postcss-color-function';
import postcssMixins from 'postcss-mixins';
import autoprefixer from 'autoprefixer';
import postcsssClassPrefix from 'postcss-class-prefix';

const opts = {
  dest: './dist'
}

gulp.task('browserify', function () {
  var files = ['./src/js/front/app.js', './src/js/back/background.js'];
  var tasks = files.map(function(entry) {
    return browserify(
      assign({}, watchify.args, {
        entries: [entry],
        debug: true
      }))
      .transform(babel.configure({
        // Use all of the ES2015 spec
        presets: ['es2015']
      }))
      .bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(entry))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(flatten())
      .pipe(gulp.dest(opts.dest + '/js'));
  });

  return es.merge.apply(null, tasks);
});


gulp.task('watchify', function() {
  var files = ['./src/js/front/app.js', './src/js/back/background.js'];
  var tasks = files.map(function(entry) {
    var bundler = watchify(browserify(
      assign({}, watchify.args, {
        entries: [entry],
        debug: true
      }))
      .transform(babel.configure({
        // Use all of the ES2015 spec
        presets: ['es2015']
      })));

    bundler.on('update', bundle);
    bundler.on('log', gutil.log);

    function bundle() {
      return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(entry))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(flatten())
        .pipe(gulp.dest(opts.dest + '/js'));
    }

    return bundle();
  });

  return es.merge.apply(null, tasks);
});

gulp.task('css', () => {
  const processors = [
    postcssPartial,
    postcssMixins,
    postcssNested,
    postcssPropertyLookup,
    postcssSimpleVars,
    postcssCalc,
    postcssColorFunction,
    postcsssClassPrefix('lio-'),
    autoprefixer({ browsers: ['last 5 Chrome versions'] })
  ];

  return gulp.src('src/css/style.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest(opts.dest));
});


gulp.task('static', function () {
  return gulp.src('./src/static/**.*')
    .pipe(gulp.dest(opts.dest));
});

gulp.task('fonts', function () {
  let base = 'node_modules/source-sans-pro/WOFF2/TTF/SourceSansPro';
  return gulp.src([
    base + '-Light.ttf.woff2',
    base + '-Regular.ttf.woff2',
    base + '-Semibold.ttf.woff2'])
    .pipe(gulp.dest(opts.dest + '/fonts/'));
});

gulp.task('clean', function() {
  del.sync(opts.dest + '/**/*');
});

gulp.task('watch', ['build', 'watchify'], function () {
  gulp.watch('./src/static/**.*', ['static']);
  gulp.watch('src/css/**/*', ['css']);
});

gulp.task('build', ['static', 'fonts', 'css', 'browserify']);
