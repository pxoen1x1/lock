/* jshint node: true */
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var config = require('../../../config');
var browserSyncOptions = config.browsersync.admin.production;

gulp.task('browsersync:admin:production', ['build:admin:production'], function () {
    var bsAdminProduction = browserSync.create('adminProduction');

    bsAdminProduction.init(browserSyncOptions);
});