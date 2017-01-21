/* jshint node: true */
'use strict';

var gulp = require('gulp');
var version = require('gulp-cordova-version');

var config = require('../../config');
var pkg = require('../../../package.json');

var path = config.cordova.src;

gulp.task('cordova:version', function () {

    return gulp.src(path)
        .pipe(version(pkg.version));
});