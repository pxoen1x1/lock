/*global sails, waterlock, UserService, AuthService, MailerService, JwtService*/

/**
 * UserController.js
 *
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

let UserController = waterlock.actions.user({
    getCurrentUser(req, res) {
        res.ok(
            {
                user: req.session.user
            }
        );
    },
    findServiceProviders(req, res) {
        let params = req.allParams();

        if ((!params.southWestLatitude || !params.southWestLongitude) ||
            (!params.northEastLatitude || !params.northEastLongitude)) {

            return res.badRequest({
                message: req.__('Submitted data is invalid.')
            });
        }

        UserService.findServiceProviders(params)
            .then(
                (serviceProviders) => res.ok({
                    serviceProviders: serviceProviders
                })
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    createUser(req, res) {
        let params = req.allParams();

        if ((!params.password || !params.email) ||
            (!params.user || !params.user.firstName || !params.user.lastName || !params.user.phoneNumber)) {

            return res.badRequest({
                message: req.__('Submitted data is invalid.')
            });
        }

        let criteria = {};

        criteria.email = params.email;

        if (params.user.details) {
            params.user.userDetail = params.user.details;

            delete params.user.details;
        }

        AuthService.findAuth(criteria)
            .then(
                (user) => {
                    if (user) {

                        return Promise.reject();
                    }

                    return AuthService.findOrCreateAuth(criteria, params);
                }
            )
            .then(
                (createdUser) => sendConfirmation(createdUser)
            )
            .then(
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
                    if (err) {
                        sails.log.err(err);

                        return res.serverError();
                    }

                    return res.badRequest({
                        message: req.__('User already exists.')
                    });
                }
            );
    },
    updateUser(req, res) {
        let id = req.params.id;
        let user = req.body;

        if (req.session.user.id !== req.params.id) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        if (!id || Object.keys(user).length === 0) {

            return res.badRequest({
                message: req.__('Please, check data.')
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
                        message: req.__('User not found.')
                    });
                }
            );
    }
});

module.exports = UserController;

function sendConfirmation(createdUser) {
    if (sails.config.application.emailVerificationEnabled) {

        return MailerService.confirmRegistration(createdUser);
    } else {

        return MailerService.successRegistration(createdUser);
    }
}
