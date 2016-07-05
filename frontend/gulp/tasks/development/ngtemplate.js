/* jshint node: true */
'use strict';

var gulp = require('gulp');
var ngTemplate = require('gulp-ng-template');
var htmlmin = require('gulp-htmlmin');
var config = require('../../config');

gulp.task('ngtemplate', function () {
    return gulp.src(config.ngtemplate.development.src)
        .pipe(htmlmin(config.htmlmin))
        .pipe(ngTemplate(config.ngtemplate.options))
        .pipe(gulp.dest(config.ngtemplate.development.dest));
});