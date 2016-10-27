/* global sails, AuthService */

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
    AuthService.getUserByToken(req)
        .then(
            (user) => {
                // valid request
                if (!req.session) {
                    req.session = {};
                }

                req.session.user = user;
                req.session.authenticated = true;

                next();
            }
        )
        .catch(
            () => {
                sails.log.debug(new Error('You are not permitted to perform this action.'));

                return res.forbidden(
                    {
                        message: req.__('You are not permitted to perform this action.')
                    }
                );
            }
        );
};
