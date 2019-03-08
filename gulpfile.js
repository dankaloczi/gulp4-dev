"use strict";

var themename = 'yourthemename';

// Load plugins
var { src, dest, watch, parallel, series } = require("gulp");

var autoprefixer = require("autoprefixer");
var browsersync = require("browser-sync").create();
//var image = require("gulp-image");
//var jshint = require('gulp-jshint');
//var newer = require("gulp-newer");
var postcss = require("gulp-postcss");
var sass = require("gulp-sass");
var sourcemaps = require('gulp-sourcemaps');
//var concat = require('gulp-concat');

// Name of working theme folder
var rootDir = '../' + themename + '/';
var paths = {
		styles: {
			src: 'sass/' + '{style.scss,rtl.scss}',
			dest: 'assets/css/'
		}
};

// CSS via Sass and Autoprefixer
function css() {
	return src(rootDir + paths.styles.src)
	.pipe(sourcemaps.init())
	.pipe(sass({
		outputStyle: 'expanded',
		indentType: 'tab',
		indentWidth: '1'
	}).on('error', sass.logError))
	.pipe(postcss([
		autoprefixer('last 2 versions', '> 1%')
	]))
	.pipe(sourcemaps.write(rootDir + 'sass/' + 'maps'))
	.pipe(dest(rootDir + paths.styles.dest));
}

// Watch files and everything
function watchFiles() {
 	watch( rootDir + '**/*.scss', css);
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
 	watch(rootDir + '**/*').on('change', browsersync.reload);
}

// export tasks
exports.css = css;
exports.browserSync = browserSync;
exports.watchFiles = watchFiles;

exports.default = series(css, parallel(watchFiles, browserSync));
