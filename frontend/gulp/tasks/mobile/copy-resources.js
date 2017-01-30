/* jshint node: true */
'use strict';

var gulp = require('gulp');

var config = require('../../config');

var options = config.cordova.resources;

gulp.task('copy:resources:mobile', function () {

    return gulp.src(options.src)
        .pipe(gulp.dest(options.dest));
});