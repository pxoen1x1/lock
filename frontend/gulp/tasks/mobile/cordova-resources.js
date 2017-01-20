/* jshint node: true */
'use strict';

var gulp = require('gulp');
var run = require('gulp-run');

gulp.task('cordova:resources',
    ['cordova:icon', 'cordova:splash'],
    function () {

        return run('echo {} > ionic.config.json && ionic resources').exec();
    }
);