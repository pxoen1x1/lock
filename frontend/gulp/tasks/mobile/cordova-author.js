/* jshint node: true */
'use strict';

var gulp = require('gulp');
var cordovaAuthor = require('gulp-cordova-author');

var config = require('../../config');

var path = config.cordova.src;
var author = config.cordova.author;

gulp.task('cordova:author', function () {

    return gulp.src('./')
        .pipe(cordovaAuthor(author.name, author.email, author.www));
});