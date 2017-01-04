/* jshint node: true */
'use strict';

var gulp = require('gulp');
var config = require('../../../config');
var copyfontsOptions = config.copyfonts.admin;

/**
 * Copy fonts to folder
 */
gulp.task('copy:fonts:admin:production', function () {
    return gulp.src(copyfontsOptions.src)
        .pipe(gulp.dest(copyfontsOptions.dest));
});