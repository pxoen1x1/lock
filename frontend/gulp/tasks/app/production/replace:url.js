/* jshint node: true */
'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');

var config = require('../../../config');
var replaceOptions = config.replace.url;

gulp.task('replace:url:production', function () {

    return gulp.src(replaceOptions.src + replaceOptions.file)
        .pipe(replace(replaceOptions.baseUrl, replaceOptions.production))
        .pipe(gulp.dest(replaceOptions.src));
});