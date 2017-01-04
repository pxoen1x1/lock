/* jshint node: true */
'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var config = require('../../../config');

/**
 * Check JavaScript sytax with JSHint
 */
gulp.task('jshint:app', function () {
    return gulp.src(config.jshint.app.src)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});