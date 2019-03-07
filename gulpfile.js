"use strict";

var themename = 'your-theme-name';

// Load plugins
const { src, dest, watch, parallel, series } = require("gulp");

const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const image = require("gulp-image");
const jshint = require('gulp-jshint');
const newer = require("gulp-newer");
const postcss = require("gulp-postcss");
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

// Name of working theme folder
global = '../' + themename + '/';
var scss = global + 'sass/';
//	js = global + 'assets/js/',
//	img = global + 'assets/images/',
//	languages = global + 'languages/';

// CSS via Sass and Autoprefixer
function css() {
	return src(scss + '{style.scss,rtl.scss}')
	.pipe(sourcemaps.init())
	.pipe(sass({
		outputStyle: 'expanded',
		indentType: 'tab',
		indentWidth: '1'
	}).on('error', sass.logError))
	.pipe(postcss([
		autoprefixer('last 2 versions', '> 1%')
	]))
	.pipe(sourcemaps.write(scss + 'maps'))
	.pipe(dest(global + 'assets/css/'));
}

// Watch files and everything
function watchFiles() {
 	watch( global + '**/*.scss', css);
}

// BrowserSync
function browserSync(done) {
	// BrowserSync, syncs browsers on different devices
	browsersync.init({
		open: 'external',
		proxy: 'https://sass.princesgardens/',
		port: 8080
	});
	done();
	watch(global + '**/*').on('change', browsersync.reload);
}

// export tasks
exports.browserSync = browserSync;
exports.css = css;
exports.watchFiles = watchFiles;

exports.default = series(css, parallel(watchFiles, browserSync));



