/* jshint node: true */
'use strict';

var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var size = require('gulp-size');

var config = require('../../config');
var imageminOptions = config.imagemin;

gulp.task('imagemin', function() {
    return gulp.src(imageminOptions.src)
        .pipe(imagemin(imageminOptions.options))
        .pipe(gulp.dest(imageminOptions.dest))
        .pipe(size());
});