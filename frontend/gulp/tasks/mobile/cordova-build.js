/* jshint node: true */
'use strict';

var gulp = require('gulp');
var cordova = require('cordova-lib').cordova;

var platforms = {
    linux: ['android'],
    ios: ['ios'],
    windows: ['windows']
};

var buildConfig = 'Release';

var buildArgs = {
    linux: ['--' + buildConfig.toLocaleLowerCase(), '--device', '--gradleArg=--no-daemon'],
    ios: ['--' + buildConfig.toLocaleLowerCase(), '--device'],
    windows: ['--' + buildConfig.toLocaleLowerCase(), '--device']
};

var currentPlatform = process.platform === 'darwin' ?
    'ios' : ((process.platform === 'linux' || process.platform === 'freebsd') ?
        'linux' : 'windows');

var platformsToBuild = platforms[currentPlatform];
var argsToBuild = buildArgs[currentPlatform];


gulp.task('cordova:build',
    function (callback) {
        cordova.build({
            'platforms': platformsToBuild,
            'options': {
                argv: argsToBuild
            }
        }, callback);
    }
);
