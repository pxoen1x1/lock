/* jshint node: true */
'use strict';

var gulp = require('gulp');
var ngTemplate = require('gulp-ng-template');
var htmlmin = require('gulp-htmlmin');

var config = require('../../../config');
var ngtemplateOptions = config.ngtemplate.options;
var ngtemplatePaths = config.ngtemplate.app;

gulp.task('ngtemplate:app', function () {
    return gulp.src(ngtemplatePaths.src)
        .pipe(htmlmin(config.htmlmin))
        .pipe(ngTemplate(ngtemplateOptions))
        .pipe(gulp.dest(ngtemplatePaths.dest));
});