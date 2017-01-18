/* jshint node: true */
'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');

var config = require('../../config');
var replaceOptions = config.replace.mobile;

gulp.task('prepare:index:mobile', function () {

    return gulp.src(replaceOptions.src + 'index.html')
        .pipe(replace(replaceOptions.from, replaceOptions.to))
        .pipe(gulp.dest(replaceOptions.src));
});