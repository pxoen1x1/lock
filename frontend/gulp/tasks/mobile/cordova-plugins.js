/* jshint node: true */
'use strict';

var gulp = require('gulp');
var plugin = require('gulp-cordova-plugin');

var config = require('../../config');

var path = config.cordova.src;
var plugins = config.cordova.plugins;

gulp.task('cordova:plugins', function () {

    return gulp.src(path)
        .pipe(plugin(plugins));
});
