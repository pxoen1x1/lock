/* jshint node: true */
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('deploy', function (callback) {
    runSequence('build:production', 'rsync', callback);
});