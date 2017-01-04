/* jshint node: true */
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var config = require('../../../config');
var development = config.sass.app.development;

gulp.task('sass:app', function () {

    return gulp.src(development.src) // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass())
        .pipe(gulp.dest(development.dest));
});