/* jshint node: true */
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build:app', function (callback) {
    runSequence('delete:app',
        [
            'sass:app',
            'copy:styles:app',
            'ngtemplate:app'
        ],
        callback);
});