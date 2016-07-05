/* jshint node: true */
'use strict';

var gulp = require('gulp');
var browsersync = require('browser-sync');
var config = require('../../config');

/**
 * Run the build task and start a server with BrowserSync
 */
gulp.task('browsersync', ['build'], function () {
    
    return browsersync(config.browsersync);
});