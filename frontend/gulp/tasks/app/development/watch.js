/* jshint node: true */
'use strict';

var gulp = require('gulp');
var config = require('../../../config');

var watchOptions = config.watch.app;

/**
 * Start browsersync task and then watch files for changes
 */
gulp.task('watch:app', function () {
    gulp.watch(watchOptions.scss, ['sass:app', 'lint-styles:app']);
    gulp.watch(watchOptions.styles, ['copy:styles:app', 'lint-styles:app']);
    gulp.watch(watchOptions.scripts, ['jshint:app']);
    gulp.watch(watchOptions.templates, ['ngtemplate:app']);
});