/* jshint node: true */
'use strict';

var gulp = require('gulp');
var del = require('del');
var config = require('../../config');
var development = config.delete.development;

/**
 * Delete folders and files
 */
gulp.task('delete', function (callback) {
    
    return del(development.src, callback);
});