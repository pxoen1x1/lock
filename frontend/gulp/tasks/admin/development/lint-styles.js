/* jshint node: true */
'use strict';

var gulp      = require('gulp');
var postcss   = require('gulp-postcss');
var stylelint = require('stylelint');
var reporter  = require('postcss-reporter');
var config    = require('../../../config');

var lintStylesPath = config.lintStyles.admin;
var lintStylesOptions = config.lintStyles.options;

gulp.task('lint-styles:admin', function () {
    return gulp.src(lintStylesPath.src)
        .pipe(postcss([
            stylelint(lintStylesOptions.stylelint),
            reporter(lintStylesOptions.reporter)
        ]));
});