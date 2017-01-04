/* jshint node: true */
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build:admin:production', function (callback) {
    runSequence('build:admin',
        [
            'copy:fonts:admin:production',
            'usemin:admin:production',
            'imagemin:admin:production'
        ],
        callback);
});