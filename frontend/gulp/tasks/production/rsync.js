/* jshint node: true */
'use strict';

var gulp = require('gulp');
var rsync  = require('gulp-rsync');

var config = require('../../config');
var rsyncOptions = config.rsync;

gulp.task('rsync', function() {
    return gulp.src(rsyncOptions.src)
        .pipe(rsync(rsyncOptions.options));
});