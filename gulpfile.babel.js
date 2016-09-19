'use strict';

import manifest from './src/manifests/manifest.json';

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
import postcssBase64 from 'postcss-inline-base64';
import mergeJson from 'gulp-merge-json';
import yargs from 'yargs';
import svg2png from 'gulp-svg2png';
import rename from 'gulp-rename';

const argv = yargs.argv;
const target = typeof argv.target === 'string' ? argv.target : 'chrome';

gutil.log(`Building for target: ${target}`);

const opts = {
  dest: './dist'
};

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
    postcssBase64({ extensions: ['.woff2'] }),
    postcsssClassPrefix('lio-', { ignore: [/c3-.*/]}),
    autoprefixer({ browsers: ['last 5 Chrome versions'] })
  ];

  return gulp.src('src/css/style.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest(opts.dest));
});

gulp.task('manifest', function () {
  if (target === 'firefox') {
    return gulp.src(['./src/manifests/manifest.json', './src/manifests/manifest-ff.json'])
      .pipe(mergeJson('manifest.json'))
      .pipe(gulp.dest(opts.dest));
  } else {
    return gulp.src(['src/manifests/manifest.json'])
      .pipe(gulp.dest(opts.dest));
  }
});

gulp.task('icon', function () {
  const src = gulp.src(['./src/icon/icon.svg']);

  for (let key in manifest.icons) {
    const size = Number.parseInt(key);
    src.pipe(svg2png({ width: size, height: size }))
      .pipe(rename(`icon${size}.png`))
      .pipe(gulp.dest(opts.dest + '/icons'));
  }
});

gulp.task('clean', function() {
  del.sync(opts.dest + '/**/*');
});

gulp.task('watch', ['build', 'watchify'], function () {
  gulp.watch('./src/static/**.*', ['manifest']);
  gulp.watch('src/css/**/*', ['css']);
});

gulp.task('build', ['manifest', 'css', 'icon', 'browserify']);
