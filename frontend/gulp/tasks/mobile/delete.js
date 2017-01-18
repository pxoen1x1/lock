/* jshint node: true */
'use strict';

var gulp = require('gulp');
var del = require('del');

var config = require('../../config');
var path = config.delete.mobile;

/**
 * Delete folders and files
 */
gulp.task('delete:mobile', function (callback) {

    return del(path.src, callback);
});