/* jshint node: true */
'use strict';

var gulp = require('gulp');
var config = require('../../config');
var configCopyfonts = config.copyfonts;

/**
 * Copy fonts to folder
 */
gulp.task('copy:fonts', function () {
    return gulp.src(configCopyfonts.src)
        .pipe(gulp.dest(configCopyfonts.dest));
});