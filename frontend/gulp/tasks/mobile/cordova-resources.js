/* jshint node: true */
'use strict';

var gulp = require('gulp');
var run = require('gulp-run');

var platforms = {
    linux: 'android',
    ios: 'ios',
    windows: 'windows'
};

var currentPlatform = process.platform === 'darwin' ?
    'ios' : ((process.platform === 'linux' || process.platform === 'freebsd') ?
        'linux' : 'windows');

var platformsToBuild = platforms[currentPlatform];

gulp.task('cordova:resources',
    function () {

        return run('echo {} > ionic.config.json && ionic resources ' + platformsToBuild).exec();
    }
);