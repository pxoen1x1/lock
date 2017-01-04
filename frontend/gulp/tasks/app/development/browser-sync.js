/* jshint node: true */
'use strict';

var gulp = require('gulp');
var browsersync = require('browser-sync');

var config = require('../../../config');
var browsersyncOptions = config.browsersync.app.development;

gulp.task('browsersync:app', ['build:app'], function () {
    
    return browsersync(browsersyncOptions);
});