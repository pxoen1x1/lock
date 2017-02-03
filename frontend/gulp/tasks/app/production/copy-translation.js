/* jshint node: true */
'use strict';

var gulp = require('gulp');
var config = require('../../../config');
var translationOptions = config.json.translation;

/**
 * Copy translation json files to folder
 */
gulp.task('copy:translation:app', function () {

    return gulp.src(translationOptions.src)
        .pipe(gulp.dest(translationOptions.dest));
});