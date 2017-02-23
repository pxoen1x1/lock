/* jshint node: true */
'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');

var config = require('../../../config');
var replaceOptions = config.replace.url;

gulp.task('replace:url', function () {

    return gulp.src(replaceOptions.src + replaceOptions.file)
        .pipe(replace(replaceOptions.baseUrl, replaceOptions.development))
        .pipe(gulp.dest(replaceOptions.src));
});