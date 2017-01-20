/* jshint node: true */
'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');

var config = require('../../config');

var options = config.cordova.icon;

gulp.task('cordova:icon', function () {

    return gulp.src(options.src)
        .pipe(rename(options.name))
        .pipe(gulp.dest(options.dest));
});