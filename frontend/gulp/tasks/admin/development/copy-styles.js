/* jshint node: true */
'use strict';

var gulp = require('gulp');
var config = require('../../../config');
var copystylesOptions = config.copystyles.admin;

/**
 * Copy fonts to folder
 */
gulp.task('copy:styles:admin', function () {
    return gulp.src(copystylesOptions.src)
        .pipe(gulp.dest(copystylesOptions.dest));
});