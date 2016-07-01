/* jshint node: true */
'use strict';

var gulp = require('gulp');
var config = require('../../config');

/**
 * Start browsersync task and then watch files for changes
 */
gulp.task('watch', function () {
    gulp.watch(config.watch.scss, ['sass', 'lint-styles']);
    gulp.watch(config.watch.styles, ['copy:styles', 'lint-styles']);
    gulp.watch(config.watch.scripts, ['jshint']);
    gulp.watch(config.watch.scripts, ['ngtemplate']);
});