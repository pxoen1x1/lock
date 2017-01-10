/* jshint node: true */
'use strict';

var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var size = require('gulp-size');

var config = require('../../../config');
var imageminPaths = config.imagemin.admin;
var imageminOptions = config.imagemin.options;

gulp.task('imagemin:admin:production', function() {
    return gulp.src(imageminPaths.src)
        .pipe(imagemin(imageminOptions))
        .pipe(gulp.dest(imageminPaths.dest))
        .pipe(size());
});