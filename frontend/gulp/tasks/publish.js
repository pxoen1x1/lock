/* jshint node: true */
'use strict';

var gulp = require('gulp');

gulp.task('publish', [
    'browsersync:app:production',
    'browsersync:admin:production'
]);