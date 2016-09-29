/* global  waterlock */

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
    waterlock.validator.validateTokenRequest(req,
        (err, user) => {
            if (err) {

                return res.forbidden(
                    {
                        message: req.__('You are not permitted to perform this action.')
                    }
                );
            }

            // valid request
            if (!req.session) {
                req.session = {};
            }

            req.session.user = user;
            req.session.authenticated = true;

            next();
        });
};