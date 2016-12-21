/* global waterlock, Auth, ResetToken */
/**
 * Auth Service
 */

'use strict';

let jwt = require('jwt-simple');

let AuthService = {
    findAuth(criteria) {

        return Auth.findOne(criteria);
    },
    findOrCreateAuth(criteria, attributes) {
        let promise = new Promise((resolve, reject) => {
            waterlock.engine.findOrCreateAuth(criteria, attributes,
                (err, user)=> {
                    if (err) {

                        return reject(err);
                    }

                    return resolve(user);
                });
        });

        return promise;
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
        let promise = new Promise((resolve, reject)=> {
            waterlock.validator.validateTokenRequest(req,
                (err, user) => {
                    if (err) {

                        return reject(err);
                    }

                    return resolve(user);
                });
        });

        return promise;
    }
};

module.exports = AuthService;
