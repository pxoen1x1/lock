/* jshint node: true */
'use strict';

var gulp = require('gulp');
var cordovaDescription = require('gulp-cordova-description');

var config = require('../../config');

var path = config.cordova.src;
var description = config.cordova.description;

gulp.task('cordova:description', function () {

    return gulp.src(path)
        .pipe(cordovaDescription(description));
});