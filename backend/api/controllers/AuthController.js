/*global async, sails, AuthService, MailerService, UserService, User*/

/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

let passport = require('passport');

let AuthController = {
    login(req, res) {
        passport.authenticate('local',
            (err, user) => {
                if (err) {
                    sails.log.error(err);

                    return res.serverError({
                        message: sails.__('User authentication failed.')
                    });
                }

                if(!user) {

                    return res.notFound({
                        message: sails.__('User not found.')
                    });
                }

                if(!user.enabled){

                    return res.badRequest({
                        message: sails.__('Please, confirm your registration.')
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

        user.token = '';
        user.emailConfirmed = true;
        user.enabled = true;

        UserService.update({token: token}, user)
            .then(
                (updatedUser) => AuthService.logIn(req, updatedUser)
            )
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
    createResetPasswordToken(req, res) {
        let email = req.body.email;

        if (!email) {
            return res.badRequest(
                {
                    message: sails.__('Email is not defined.')
                }
            );
        }

        async.waterfall([
                async.apply(createResetPasswordToken, email),
                sendPasswordResetRequest
            ],
            (err, user) => {
                if (err) {

                    return res.serverError();
                }

                if (!user) {

                    return res.notFound(
                        {
                            message: sails.__('User not found.')
                        }
                    );
                }

                res.ok();
            });
    },
    openPasswordResetPage(req, res) {
        let token = req.param('token');

        if (!token) {

            return res.badRequest(
                {
                    message: sails.__('Token is not defined.')
                }
            );
        }

        User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {'>': Date.now()}
        }).exec((err, user) => {
            if (err) {
                sails.log.error(err);

                return res.serverError();
            }

            if (!user) {

                return res.notFound(
                    {
                        message: sails.__('Password reset token is invalid or has expired.')
                    }
                );
            }

            res.render('passwordReset', {
                user: req.user,
            });
        });
    },
    resetPassword(req, res) {
        let token = req.param('token');
        let password = req.body.password;

        if (!token) {

            return res.badRequest(
                {
                    message: sails.__('Token is not defined.')
                }
            );
        }

        if (!password) {

            return res.badRequest(
                {
                    message: sails.__('Password is not defined.')
                }
            );
        }

        async.waterfall([
                async.apply(resetPassword, req),
                sendPasswordResetConfirmation
            ],
            (err, user) => {
                if (err) {
                    sails.log.error();

                    return res.serverError();
                }

                if (!user) {

                    return res.badRequest(
                        {
                            message: sails.__('Password reset token is invalid or has expired.')
                        }
                    );
                }

                res.redirect(sails.config.homePage);
            });
    }
};

function createResetPasswordToken(email, done) {
    let user = {};

    let resetPasswordExpiresTimestamp = Date.now() + sails.config.application.resetPasswordExpiresTime;

    user.resetPasswordToken = UserService.generateToken();
    user.resetPasswordExpires = new Date(resetPasswordExpiresTimestamp).toUTCString();

    UserService.update({email: email}, user)
        .then(
            (updatedUser) => done(null, updatedUser)
        )
        .catch(
            (err) => {
                if (err) {
                    return done(err);
                }

                return done(null, null);
            }
        );
}

function sendPasswordResetRequest(user, done) {
    if (!user) {

        return done(null, null);
    }

    MailerService.passwordResetRequest(user)
        .then(
            () => done(null, user)
        )
        .catch(
            (err) => done(err)
        );
}

function resetPassword(req, done) {
    let user = {};

    let token = req.param('token');

    user.password = req.body.password;
    user.resetPasswordToken = '';
    user.resetPasswordExpires = null;

    UserService.update({
        resetPasswordToken: token,
        resetPasswordExpires: {'>': Date.now()}
    }, user)
        .then(
            (updatedUser) => AuthService.logIn(req, updatedUser)
        )
        .then(
            (updatedUser) => done(null, updatedUser)
        )
        .catch(
            (err)=> {
                if (err) {

                    return done(err);
                }

                return done(null, null);
            }
        );
}

function sendPasswordResetConfirmation(user, done) {
    if (!user) {

        return done(null, null);
    }

    MailerService.passwordResetConfirmation(user)
        .then(
            () => done(null, user)
        )
        .catch(
            (err) => done(err)
        );
}

module.exports = AuthController;

