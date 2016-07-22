/* jshint node: true */
'use strict';

var gulp = require('gulp');
var browsersync = require('browser-sync');

var config = require('../../config');
var browsersyncOptions = config.browsersync.development;

gulp.task('browsersync', ['build'], function () {
    
    return browsersync(browsersyncOptions);
});