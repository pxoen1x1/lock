/* jshint node: true */
'use strict';

var gulp = require('gulp');
var usemin = require('gulp-usemin');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var replace = require('gulp-replace');
var rev = require('gulp-rev');
var size = require('gulp-size');

var config = require('../../config');
var userminOptions = config.usemin;
var htmlminOptions = config.htmlmin.options;
var replaceOptions = config.replace;


gulp.task('usemin', function () {
    return gulp.src(userminOptions.src)
        .pipe(usemin({
            css: [
                cleanCSS(),
                'concat',
                rev()
            ],
            html: [htmlmin(htmlminOptions)],
            js: [
                stripDebug(),
                uglify(),
                rev()
            ],
            vendorcss: [
                cleanCSS(),
                'concat',
                replace(replaceOptions.materialIcons.from, replaceOptions.materialIcons.to)
            ],
            vendorjs: [uglify()]
        }))
        .pipe(gulp.dest(userminOptions.dest))
        .pipe(size());
});