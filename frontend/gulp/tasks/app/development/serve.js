/* jshint node: true */
'use strict';

var gulp = require('gulp');

/**
 * Start webserver task and then watch files for changes
 */
gulp.task('serve:app', ['browsersync:app', 'watch:app']);