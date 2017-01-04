/* jshint node: true */
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build:admin', function (callback) {
    runSequence('delete:admin',
        [
            'sass:admin',
            'copy:styles:admin',
            'ngtemplate:admin'
        ],
        callback);
});