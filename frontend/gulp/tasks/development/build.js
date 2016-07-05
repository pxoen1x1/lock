/* jshint node: true */
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build', function (callback) {
    runSequence('delete',
        [
            'sass',
            'copy:styles',
            'ngtemplate'
        ],
        callback);
});