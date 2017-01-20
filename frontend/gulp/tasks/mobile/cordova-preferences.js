/* jshint node: true */
'use strict';

var gulp = require('gulp');
var preference = require('gulp-cordova-preference');

var config = require('../../config');

var path = config.cordova.src;
var preferences = config.cordova.preferences;

gulp.task('cordova:preferences', function () {

    return gulp.src('./')
        .pipe(preference(preferences));
});