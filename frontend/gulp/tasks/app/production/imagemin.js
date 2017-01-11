/* jshint node: true */
'use strict';

var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var size = require('gulp-size');

var config = require('../../../config');
var imageminPaths = config.imagemin.app;
var imageminOptions = config.imagemin.options;

gulp.task('imagemin:app', function() {
    return gulp.src(imageminPaths.src)
        .pipe(imagemin(imageminOptions))
        .pipe(gulp.dest(imageminPaths.dest))
        .pipe(size());
});