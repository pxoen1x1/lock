/* jshint node: true */
'use strict';

var gulp = require('gulp');
var cordovaIcon = require('gulp-cordova-icon');

var config = require('../../config');

var path = config.cordova.src;
var icon = config.cordova.icon;

gulp.task('cordova:icon', function () {

    return gulp.src(path)
        .pipe(cordovaIcon(icon));
});