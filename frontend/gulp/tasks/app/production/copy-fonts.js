/* jshint node: true */
'use strict';

var gulp = require('gulp');
var config = require('../../../config');
var copyfontsOptions = config.copyfonts.app;

/**
 * Copy fonts to folder
 */
gulp.task('copy:fonts:app', function () {
    return gulp.src(copyfontsOptions.src)
        .pipe(gulp.dest(copyfontsOptions.dest));
});