/* jshint node: true */
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build:app:production', function (callback) {
    runSequence('build:app',
        [
            'copy:fonts:app',
            'usemin:app',
            'imagemin:app'
        ],
        callback);
});