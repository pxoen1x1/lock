/* jshint node: true */
'use strict';

var gulp = require('gulp');

gulp.task('build:production', [
    'build:app:production',
    'build:admin:production'
]);