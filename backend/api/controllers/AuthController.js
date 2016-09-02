/* global sails, waterlock, UserService, AuthService, MailerService*/
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
                    message: req.__('Token is not defined.')
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
                            message: req.__('User authentication failed.')
                        });
                    }

                    return res.notFound({
                        message: req.__('User not found.')
                    });
                }
            );
    },
    createResetAuthToken(req, res){
        let params = req.allParams();

        if (!params.email) {

            return res.badRequest({
                message: req.__('Email is not defined.')
            });
        }

        AuthService.resetAuthToken(params.email)
            .then(
                (user) => {
                    return MailerService.passwordResetRequest(user);
                }
            )
            .then(
                () => res.ok(true)
            )
            .catch(
                (err) => {
                    if (err) {
                        sails.log.error(err);

                        return res.serverError();
                    }

                    return res.badRequest({
                        message: req.__('Email not found.')
                    });
                }
            );
    },
    openPasswordResetPage(req, res) {
        let params = req.allParams('token');

        AuthService.validateToken(params)
            .then(
                (auth) => {
                    req.session.resetToken = auth.resetToken;

                    res.render('passwordReset', {
                        user: auth.user,
                    });
                }
            )
            .catch(
                (err) => {
                    if (err.name === 'Error') {

                        return res.serverError();
                    }

                    res.forbidden({
                        message: req.__(err)
                    });
                }
            );
    },
    resetPassword(req, res) {
        let params = req.allParams();
        let owner = req.session.resetToken.owner;

        if (!params.password) {

            return res.badRequest({
                message: req.__('Password is not defined.')
            });
        }

        AuthService.resetPassword(owner, params.password)
            .then(
                () => {
                    req.session.resetToken = false;

                    res.redirect(sails.config.homePage);
                }
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    }
});

module.exports = AuthController;