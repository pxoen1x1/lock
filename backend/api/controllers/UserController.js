'use strict';
/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let UserController = {
    getUser (req, res) {
        res.ok(
            {
                user: req.user
            }
        );
    },
    createUser(req, res) {
        let user = req.body;

        async.waterfall([
                async.apply(createUser, user),
                sendConfirmation
            ],
            (err, createdUser) => {
                if (err) {
                    sails.log.error(err);

                    return res.serverError();
                }

                res.created(
                    {
                        user: createdUser
                    }
                );
            });
    },
    updateUser(req, res) {
        let id = req.params.id;
        let user = req.body;

        if (!id || Object.keys(user).length === 0) {

            return res.badRequest({
                message: sails.__('Please, check data.')
            });
        }

        if (user.password) {
            delete user.password;
        }

        if (user.id) {
            delete user.id;
        }

        UserService.update({id: id}, user)
            .then((updatedUser) => res.ok(
                {
                    user: updatedUser
                }
            ))
            .catch(
                (err) => {
                    if (err) {
                        sails.log.error(err);

                        return res.serverError();
                    }

                    return res.notFound({
                        message: sails.__('User not found.')
                    });
                }
            );
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

function createUser(user, done) {
    UserService.create(user)
        .then(
            (createdUser) => {
                done(null, createdUser);
            }
        )
        .catch(
            (err) => {
                done(err);
            }
        );
}

function sendConfirmation(createdUser, done) {
    if (sails.config.application.emailVerificationEnabled) {
        MailerService.confirmRegistration(createdUser)
            .then(
                () => done(null, createdUser)
            )
            .catch(
                (err) => done(err)
            );
    } else {
        MailerService.successRegistration(createdUser)
            .then(
                () => done(null, createdUser)
            )
            .catch(
                (err) => done(err)
            );
    }
}

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

module.exports = UserController;