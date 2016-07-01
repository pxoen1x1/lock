/* jshint node: true */
'use strict';

var gulp = require('gulp');
var config = require('../../config');

/**
 * Copy fonts to folder
 */
gulp.task('copy:styles', function () {
    return gulp.src(config.copystyles.src)
        .pipe(gulp.dest(config.copystyles.dest));
});