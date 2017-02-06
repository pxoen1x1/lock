/* jshint node: true */
'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');

var config = require('../../config');
var replaceOptions = config.replace.mobile;

gulp.task('replace:mobile', function () {

    return gulp.src(replaceOptions.src + replaceOptions.files)
        .pipe(replace(replaceOptions.link.from, replaceOptions.link.to))
        .pipe(replace(replaceOptions.script.from, replaceOptions.script.to))
        .pipe(replace(replaceOptions.ngApp.from, replaceOptions.ngApp.to))
        .pipe(replace(replaceOptions.translation.from, replaceOptions.translation.to))
        .pipe(gulp.dest(replaceOptions.src));
});