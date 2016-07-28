'use strict';
/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let passport = require('passport');

let AuthController = {
    login(req, res) {
        passport.authenticate('local',
            (err, user) => {
                if (err || !user) {
                    sails.log.error(err);

                    return res.badRequest({
                        message: sails.__('User authentication failed.')
                    });
                }

                AuthService.logIn(req, user)
                    .then(
                        (user) => res.ok({user: user})
                    )
                    .catch(
                        (err) => {
                            sails.log.error(err);

                            return res.serverError({
                                message: sails.__('User authentication failed.')
                            });
                        }
                    );
            })(req, res);
    },

    logout: function (req, res) {
        req.logout();

        res.ok(true);
    },

    isAuthenticated(req, res) {
        if (!req.isAuthenticated()) {

            return res.ok(false);
        }

        res.ok(req.user);
    }
};

module.exports = AuthController;

