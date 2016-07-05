/* jshint node: true */
'use strict';

var gulp = require('gulp');
var scsslint = require('gulp-scss-lint');

gulp.task('scss-lint', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(scsslint());
});