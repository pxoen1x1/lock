/* jshint node: true */
'use strict';

var gulp = require('gulp');
var browsersync = require('browser-sync');

var config = require('../../../config');
var browsersyncOptions = config.browsersync.app.production;

gulp.task('browsersync:app:production', ['build:app:production'], function () {
    browsersync(browsersyncOptions);
});
