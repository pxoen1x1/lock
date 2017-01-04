/* jshint node: true */
'use strict';

var gulp = require('gulp');
var changed = require('gulp-changed');
var config = require('../../../config');

/**
 * Copy images to build folder
 * if not changed
 */
gulp.task('images:app', function () {
    return gulp.src(config.images.src)
        .pipe(changed(config.images.dest)) // Ignore unchanged files
        .pipe(gulp.dest(config.images.dest));
});