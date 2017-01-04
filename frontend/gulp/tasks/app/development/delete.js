/* jshint node: true */
'use strict';

var gulp = require('gulp');
var del = require('del');

var config = require('../../../config');
var deleteOptions = config.delete.app;

/**
 * Delete folders and files
 */
gulp.task('delete:app', function (callback) {
    
    return del(deleteOptions.src, callback);
});