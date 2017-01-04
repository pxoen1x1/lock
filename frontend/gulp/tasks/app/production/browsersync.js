/* jshint node: true */
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var config = require('../../../config');
var browserSyncOptions = config.browsersync.app.production;

gulp.task('browsersync:app:production', ['build:app:production'], function () {
    var bsAppProduction = browserSync.create('appProduction');

    bsAppProduction.init(browserSyncOptions);
});
