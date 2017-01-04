/* jshint node: true */
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var config = require('../../../config');
var browserSyncOptions = config.browsersync.admin.development;

gulp.task('browsersync:admin', ['build:admin'], function () {
    var bsAdmin = browserSync.create('admin');

    bsAdmin.init(browserSyncOptions);
});