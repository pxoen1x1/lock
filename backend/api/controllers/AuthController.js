/* global sails, waterlock, UserService*/
/**
 * AuthController
 *
 * @module      :: Controller
 * @description    :: Provides the base authentication
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

let AuthController = waterlock.waterlocked({
    confirmEmail(req, res) {
        let token = req.param('token');

        if (!token) {

            return res.badRequest(
                {
                    message: sails.__('Token is not defined.')
                }
            );
        }

        let user = {};

        user.emailConfirmationToken = '';
        user.isEmailConfirmed = true;
        user.isEnabled = true;

        UserService.update({emailConfirmationToken: token}, user)
            .then(
                () => res.redirect(sails.config.homePage)
            )
            .catch(
                (err) => {
                    if (err) {
                        sails.log.error(err);

                        return res.serverError({
                            message: sails.__('User authentication failed.')
                        });
                    }

                    return res.notFound({
                        message: sails.__('User not found.')
                    });
                }
            );
    },
});

module.exports = AuthController;