/* jshint node: true */
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build:mobile', function (callback) {
    runSequence(
        'delete:mobile',
        // 'build:app:production',
        'cordova:create',
        'prepare:index:mobile',
        [
            'cordova:plugins',
            'cordova:preferences',
            'cordova:version',
            'cordova:description',
            'cordova:author',
            'cordova:icon'
        ],
        'cordova:build',
        callback);
});