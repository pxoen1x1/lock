'use strict';
/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let passport = require('passport');

let AuthController = {
    login: function (req, res) {
        passport.authenticate('local', function (err, user, info) {
            if (err || !user) {
                return res.forbidden({
                    message: info.message
                });
            }

            req.logIn(user, function (err) {
                if (err) {
                    res.serverError(err);
                }

                return res.ok({
                    user: user
                });
            });
        })(req, res);
    }
};

module.exports = AuthController;

