/* global sails, waterlock, User, AuthService, MailerService, JwtService, UserService, SplashPaymentService */
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
    _config: {
        actions: true,
        rest: true
    },

    register(req, res) {
        let params = req.allParams();
        let auth = params.auth;
        let sendGeneratedPassword = false;


        if ((!auth || !auth.email) ||
            (!auth.user || !auth.user.firstName || !auth.user.lastName)) { // || !auth.user.phoneNumber

            return res.badRequest({
                message: req.__('Submitted data is invalid.')
            });
        }

        if (!auth.password) {
            sendGeneratedPassword = true;
            auth.password = AuthService.generatePassword();
        }


        AuthService.register(auth)
            .then(
                (createdUser) => {

                    return [createdUser, GroupService.getAdminsGroup(createdUser)];
                }
            )
            .spread(
                (createdUser, groups) => {

                    if (createdUser.details || groups) {

                        return createdUser;
                    }

                    return SplashPaymentService.createCustomer(createdUser, auth.email)
                        .then(
                            (customerResponse) => {
                                let customerArray = JSON.parse(customerResponse);

                                createdUser.spCustomerId = customerArray[0].id;

                                return UserService.updateUser(createdUser);
                            }
                        );
                }
            )
            .then(
                (createdUser) => sendConfirmation(createdUser)
            )
            .then(
                (createdUser) => {
                    if (sendGeneratedPassword) {
                        return [createdUser, MailerService.generatedPassword(auth.password, auth.email)];
                    } else {
                        return [createdUser];
                    }
                }
            )
            .spread(
                (createdUser) => {
                    // store user in && authenticate the session
                    req.session.user = createdUser;
                    req.session.authenticated = true;

                    let jwtData = waterlock._utils.createJwt(req, res, createdUser);

                    return JwtService.create(jwtData, createdUser);
                }
            )
            .then(
                (createdJwt) => res.created(createdJwt)
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    let message = err.isToSend ? {message: err.message} : null;

                    return res.serverError(message);
                }
            );
    },
    logout(req, res){
        let user = req.session.user;
        let uuid = req.body.uuid;

        AuthService.logout(req, res, user, uuid)
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
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

        User.update({emailConfirmationToken: token}, user)
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
        let email = params.email;

        if (!email) {

            return res.badRequest({
                message: req.__('Email is not defined.')
            });
        }

        AuthService.resetAuthToken(email)
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
        let password = params.password;

        let owner = req.session.resetToken.owner;

        if (!password) {

            return res.badRequest({
                message: req.__('Password is not defined.')
            });
        }

        AuthService.resetPassword(owner, password)
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
    },
    checkUniqueFields(req, res) {
        let params = req.allParams();

        let ssn = params.ssn;
        let phoneNumber = params.phoneNumber;
        let email = params.email;

        if (!ssn && !phoneNumber && !email) {

            return res.badRequest({
                message: req.__('Submitted data is invalid.')
            });
        }

        let response = {};

        let hasToken = req.headers.authorization && req.headers.authorization.match('Bearer');

        let promiseCheckSSN = ssn ? UserService.getUserBySSN(ssn) : Promise.resolve();
        let promiseCheckPhoneNumber = phoneNumber ? UserService.getUserByPhoneNumber(phoneNumber) : Promise.resolve();
        let promiseCheckEmail = email ? AuthService.getAuthByEmail(email) : Promise.resolve();
        let promiseGetUser = hasToken ? AuthService.getUserByToken(req) : Promise.resolve();

        Promise.all([
            promiseCheckSSN,
            promiseCheckPhoneNumber,
            promiseCheckEmail,
            promiseGetUser
        ])
            .then(
                (params) => {
                    let userId = params[3] ? params[3].id : null;

                    if (ssn) {
                        response.ssn = !!(params[0] && userId !== params[0].id);
                    }

                    if (phoneNumber) {
                        response.phoneNumber = !!(params[1] && userId !== params[1].id);
                    }

                    if (email) {
                        response.email = !!(params[2] && userId !== params[2].id);
                    }

                    res.ok(response);
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

function sendConfirmation(createdUser) {
    if (sails.config.application.emailVerificationEnabled) {

        return MailerService.confirmRegistration(createdUser);
    } else {

        return MailerService.successRegistration(createdUser);
    }
}