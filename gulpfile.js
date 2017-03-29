'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var path = require('path');
var Builder = require('systemjs-builder');
var argv = require('yargs').argv;
var fs = require('fs');
var del = require('del');
var appConfig = require(`${__dirname}/app-config.json`);
var profile = typeof argv.profile === 'undefined' ? 'dev' : (argv.profile === '' ? 'dev' : argv.profile)

gulp.task('styles', () => {
	console.log('Building styles...');

	return Promise.all([
		buildGlobalStyles(profile),
		buildAppStyles('sarah', profile)
	]).then(() => console.log("Styles built."));
});

gulp.task('configure', [ 'styles' ], () => {
	console.log(`Configuring ${profile}...`);

	return Promise.all([
		buildAppConfig(profile),
	]).then(() => console.log("done"));
});

gulp.task('build', [ 'configure' ], () => {
	console.log(`Packaging ${profile}...`);

	return Promise.all([
		buildPackage('sarah', profile)
	]).then(() => console.log("done"));
});

gulp.task('bundle', [ 'build' ], () => {
	console.log(`Bundling ${profile}...`);

	return gulp.src([
			'**/*.{html,css,js,js.map}',
			'src/icons/**',
			'src/images/**'
		], { base: './src' })
		.pipe(gulp.dest('dist'))
		.on('end', () => { console.log("done") });
});

gulp.task('watch', [ 'configure' ], () => {
	console.log('Watching style changes....');
	let src = `${__dirname}/src/**/*.scss`;

	return gulp.watch(src, [ 'styles' ]);
});

gulp.task('clean', () => {
	return del([
		'dist',
		'src/**/*.{css,js,js.map}',
		'!src/app-importer.js',
		'!src/systemjs.config.js',
		'!src/common/**'
	]);
});

var buildPackage = (app, profile) => {
	let src = `${__dirname}/src/${app}/main.ts`;
	let dest = `${__dirname}/src/${app}/dist/${app}.js`;
	let builder = new Builder(`${__dirname}/src`, `${__dirname}/src/systemjs.config.js`);

	let prodlike = [ 'beta', 'gamma', 'prod' ].indexOf(profile) === 0;

	return builder.buildStatic(src, dest, {
		minify: prodlike ? true : false,
		mangle: false,
		sourceMaps: prodlike ? false : true,
		encodeNames: false
	});
};

var buildGlobalStyles = (profile) => {
	let src = `${__dirname}/src/sass/*.scss`;
	let dest = `${__dirname}/src/dist`;

	return buildStyles(src, dest, profile);
};

var buildAppStyles = (app, profile) => {
	let dir = `${__dirname}/src/${app}/`;
	let src = dir + '**/*.scss';

	return buildStyles(src, dir, profile);
};

var buildStyles = (src, dest, profile) => {
	let incNode = `${__dirname}/node_modules`;
	let incSrc = `${__dirname}/src`;
	let incSass = `${__dirname}/src/sass/`;

	let prodlike = [ 'beta', 'gamma', 'prod' ].indexOf(profile) === 0;

	let options = {
		outputStyle: prodlike ? 'compressed' : 'nested',
		sourceMapEmbed: prodlike ? false : true,
		includePaths: [incSrc, incSass, incNode ]
	};

	return new Promise((resolve, reject) => {
		gulp.src(src)
			.pipe(sass(options))
			.on('error', reject)
			.pipe(gulp.dest(dest))
			.on('end', resolve);
	});
};

var buildAppConfig = (profile) => {
	let config = appConfig[profile];
	var content = 'export class AppConfig {';
	for(var property in config) {
		let type = typeof config[property];
		let quote = type === 'string' ? "'" : "";
		content += `
		static get ${property}(): ${type} {
			return ${quote}${config[property]}${quote};
		}`
	}
	content += '\n}';
	fs.writeFileSync('src/app-config.ts', content);
};
