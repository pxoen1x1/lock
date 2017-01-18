/* jshint node: true */
'use strict';

var gulp = require('gulp');
var create = require('gulp-cordova-create');

var config = require('../../config');

var path = config.cordova.create.src;
var options = config.cordova.create.options;

gulp.task('cordova:create', function () {

    return gulp.src(path)
        .pipe(create(options));
});