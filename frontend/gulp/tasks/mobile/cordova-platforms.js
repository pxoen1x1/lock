/* jshint node: true */
'use strict';

var gulp = require('gulp');
var cordova = require('cordova-lib').cordova;

var platforms = {
    linux: ['android'],
    ios: ['ios'],
    windows: ['windows']
};

var currentPlatform = process.platform === 'darwin' ?
    'ios' : ((process.platform === 'linux' || process.platform === 'freebsd') ?
        'linux' : 'windows');

var platformsToBuild = platforms[currentPlatform];

gulp.task('cordova:platforms',
    function (callback) {

        cordova.platform('add', platformsToBuild,
            callback);
    }
);