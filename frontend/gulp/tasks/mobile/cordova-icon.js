/* jshint node: true */
'use strict';

var gulp = require('gulp');

var config = require('../../config');

var options = config.cordova.icon;

gulp.task('cordova:icon', function () {

    return gulp.src(options.src)
        .pipe(gulp.dest(options.dest));
});