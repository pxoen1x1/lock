'use strict';
/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let passport = require('passport');

let AuthController = {
    login(request, response) {
        passport.authenticate('local',
            (error, user) => {
                if (error || !user) {

                    return response.forbidden({
                        message: sails.__('User authentication failed.')
                    });
                }

                request.logIn(user,
                    (error) => {
                        if (error) {

                            return response.serverError({
                                message: sails.__('User authentication failed.')
                            });
                        }

                        response.ok({user: user});
                    });
            })(request, response);
    },

    logout: function (request, response) {
        request.logout();

        response.ok(true);
    },

    isAuthenticated(request, response) {
        if (!request.isAuthenticated()) {

            return response.ok(false);
        }

        response.ok(request.user);
    }
};

module.exports = AuthController;

