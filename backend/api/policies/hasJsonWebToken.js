/* global  waterlock */
/* jshint unused:false */

/**
 * hasJsonWebToken
 *
 * @module      :: Policy
 * @description :: Assumes that your request has an jwt;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    waterlock.validator.validateTokenRequest(req, function (err, user) {
        if (err) {

            return res.forbidden('You are not permitted to perform this action.');
        }

        // valid request
        req.user = user;

        next();
    });
};
