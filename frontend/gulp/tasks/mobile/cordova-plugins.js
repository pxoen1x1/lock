/* jshint node: true */
'use strict';

var gulp = require('gulp');
var cordova = require('cordova-lib').cordova;

var config = require('../../config');
var plugins = config.cordova.plugins;

gulp.task('cordova:plugins',
    function (callback) {
        var dir = process.cwd() + '/mobile';
        process.chdir(dir);

        cordova.plugin('add', plugins, {save: true},
            callback);
    });