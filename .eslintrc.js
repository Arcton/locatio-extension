module.exports = {
	'rules': {
		'indent': [
			2,
			2
		],
		'quotes': [
			2,
			'single'
		],
		'linebreak-style': [
			2,
			'unix'
		],
		'semi': [
			2,
			'always'
		]
	},
	'env': {
		'es6': true,
		'commonjs': true,
		'browser': true,
		'webextensions': true
	},
	"parserOptions": {
		'ecmaVersion': 6,
		'sourceType': 'module'
	},
	'extends': 'eslint:recommended'
};
