/* jshint node: true */
'use strict';

var gulp = require('gulp');
var browsersync = require('browser-sync');

var config = require('../../config');
var browsersyncOptions = config.browsersync.production;

gulp.task('browsersync:production', ['build:production'], function () {
    browsersync(browsersyncOptions);
});
