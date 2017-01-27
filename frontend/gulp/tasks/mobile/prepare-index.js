/* jshint node: true */
'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');
var inject = require('gulp-inject-string');

var config = require('../../config');
var replaceOptions = config.replace.mobile;

gulp.task('prepare:index:mobile', function () {

    return gulp.src(replaceOptions.src + 'index.html')
        .pipe(replace(replaceOptions.injectionsFrom, replaceOptions.injectionsTo))
        .pipe(replace(replaceOptions.ngAppFrom, replaceOptions.ngAppTo))
        .pipe(inject.before(replaceOptions.scriptsFrom, replaceOptions.scriptsTo))
        .pipe(gulp.dest(replaceOptions.src));
});