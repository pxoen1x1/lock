/* jshint node: true */
'use strict';

var gulp = require('gulp');
var config = require('../../../config');

var watchOptions = config.watch.admin;

/**
 * Start browsersync task and then watch files for changes
 */
gulp.task('watch:admin', function () {
    gulp.watch(watchOptions.scss, ['sass:admin', 'lint-styles:admin']);
    gulp.watch(watchOptions.styles, ['copy:styles:admin', 'lint-styles:admin']);
    gulp.watch(watchOptions.scripts, ['jshint:admin']);
    gulp.watch(watchOptions.templates, ['ngtemplate:admin']);
});