/* jshint node: true */
'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject-string');

var config = require('../../config');
var injectOptions = config.inject.mobile.index;

gulp.task('prepare:index:mobile', function () {

    return gulp.src(injectOptions.src + injectOptions.file)
        .pipe(inject.before(injectOptions.search, injectOptions.string))
        .pipe(gulp.dest(injectOptions.src));
});