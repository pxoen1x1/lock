/* jshint node: true */
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var config = require('../../../config');
var browserSyncOptions = config.browsersync.app.development;

gulp.task('browsersync:app', ['build:app'], function () {
    var bsApp = browserSync.create('app');

    bsApp.init(browserSyncOptions);
});