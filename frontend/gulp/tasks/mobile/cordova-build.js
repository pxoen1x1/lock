/* jshint node: true */
'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var android = require('gulp-cordova-build-android');
var ios = require('gulp-cordova-build-ios');

var currentPlatform = process.platform === 'darwin' ?
    'ios' : ((process.platform === 'linux' || process.platform === 'freebsd') ?
        'linux' : 'windows');

gulp.task('cordova:build', function () {

    return gulp.src('mobile/')
        .pipe(gulpif(currentPlatform === 'linux', android({release: true})))
        .pipe(gulpif(currentPlatform === 'ios', ios({release: true})))
        .pipe(gulp.dest('builds'));
});
