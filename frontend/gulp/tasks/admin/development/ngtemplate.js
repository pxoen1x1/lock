/* jshint node: true */
'use strict';

var gulp = require('gulp');
var ngTemplate = require('gulp-ng-template');
var htmlmin = require('gulp-htmlmin');

var config = require('../../../config');
var ngtemplateOptions = config.ngtemplate.admin;

gulp.task('ngtemplate:admin', function () {
    return gulp.src(ngtemplateOptions.src)
        .pipe(htmlmin(config.htmlmin))
        .pipe(ngTemplate(ngtemplateOptions.options))
        .pipe(gulp.dest(ngtemplateOptions.dest));
});