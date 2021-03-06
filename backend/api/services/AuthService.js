/* global waterlock, Auth, ResetToken, HelperService, UserService, SocketService, DeviceService */
/**
 * Auth Service
 */

'use strict';

let jwt = require('jwt-simple');
let passwordGenerator = require('generate-password');

let AuthService = {
    findAuth(criteria) {

        return Auth.findOne(criteria);
    },
    findOrCreateAuth(criteria, attributes) {
        let promise = new Promise((resolve, reject) => {
            waterlock.engine.findOrCreateAuth(criteria, attributes,
                (err, user) => {
                    if (err) {

                        return reject(err);
                    }

                    return resolve(user);
                });
        });

        return promise;
    },
    register(auth){
        let userDetail;
        let criteria = {
            email: auth.email
        };

        if (auth.user.id) {
            delete auth.user.id;
        }

        if (auth.user.details) {
            userDetail = auth.user.details;

            delete auth.user.details;
        }

        return Auth.findOne(criteria)
            .then(
                (foundUser) => {
                    if (foundUser) {
                        let error = new Error();
                        error.message = 'User already exists.';
                        error.isToSend = true;

                        return Promise.reject(error);
                    }

                    return this.findOrCreateAuth(criteria, auth);
                })
            .then(
                (createdUser) => {
                    if (!userDetail) {

                        return createdUser;
                    }

                    if (userDetail.id) {
                        delete userDetail.id;
                    }

                    userDetail.user = createdUser.id;

                    createdUser.userDetail.add(userDetail);

                    return HelperService.saveModel(createdUser)
                        .then(
                            (user) => {

                                return UserService.getUser(user);
                            }
                        );
                }
            );
    },
    logout(req, res, user, uuid) {
        let roomName = `user_${user.id}`;

        return SocketService.unsubscribeFromAll(roomName)
            .then(
                () => {
                    waterlock.cycle.logout(req, res);

                    if (!uuid) {

                        return;
                    }

                    return DeviceService.removeUserFromDevice(uuid);
                }
            );
    },
    resetAuthToken(email){
        let user = {};

        return Auth.findOneByEmail(email)
            .populate('user')
            .then(
                (auth) => {
                    if (!auth) {

                        return Promise.reject();
                    }
                    user = auth.user;

                    return ResetToken.create({owner: auth.id})
                        .then(
                            (token) => {
                                user.resetToken = token;

                                return Auth.update({id: auth.id}, {resetToken: token.id});
                            }
                        )
                        .then(
                            (updatedAuth) => {
                                user.auth = updatedAuth[0];

                                return user;
                            }
                        );
                }
            );
    },
    resetPassword(owner, password) {

        return Auth.findOne(owner)
            .populate('resetToken')
            .then(
                (auth) => {
                    let tokenId = auth.resetToken.id;

                    return Auth.update(
                        {
                            id: auth.id
                        },
                        {
                            resetToken: null,
                            password: password
                        }
                    )
                        .then(
                            () => ResetToken.destroy(tokenId)
                        );
                }
            );
    },
    validateToken(params) {
        if (!params.token) {

            return Promise.reject('Token is not defined.');
        }

        try {
            let token = jwt.decode(params.token, waterlock.config.jsonWebTokens.secret);
            // set the time of the request
            let reqTime = Date.now();

            // If token is expired
            if (token.exp <= reqTime) {

                return Promise.reject('Your token is expired.');
            }

            // If token is early
            if (reqTime <= token.nbf) {

                return Promise.reject('This token is early.');
            }

            // If audience doesn't match
            if (waterlock.config.jsonWebTokens.audience !== token.aud) {

                return Promise.reject('This token cannot be accepted for this domain.');
            }

            // If the subject doesn't match
            if ('password reset' !== token.sub) {

                return Promise.reject('This token cannot be used for this request.');
            }

            return Auth.findOne(token.iss)
                .populate('resetToken')
                .then(
                    (auth) => {
                        if (typeof auth.resetToken === 'undefined' || params.token !== auth.resetToken.token) {

                            return Promise.reject('This token cannot be used.');
                        }

                        return auth;
                    }
                );
        }
        catch (err) {

            return Promise.reject(err);
        }
    },
    getAuthByEmail(email) {

        return Auth.findOneByEmail(email)
            .then(
                (auth) => auth
            );
    },
    getUserByToken(req) {
        let promise = new Promise((resolve, reject) => {
            waterlock.validator.validateTokenRequest(req,
                (err, user) => {
                    if (err) {

                        return reject(err);
                    }

                    return resolve(user);
                });
        });

        return promise;
    },

    generatePassword() {
        return passwordGenerator.generate({
            length: 10,
            numbers: true
        });
    }
};

module.exports = AuthService;
