/* global sails, User, UserDetailService */

'use strict';

let bcryptjs = require('bcryptjs');
let crypto = require('crypto');

let UserService = {
    getUser(user) {
        let promise = new Promise((resolve, reject) => {
                User.findOneById(user.id)
                    .populate('addresses')
                    .exec(
                        (err, foundUser) => {
                            if (err) {

                                return reject(err);
                            }

                            UserDetailService.getUserDetailByUser(foundUser)
                                .then(
                                    (userDetails) => {
                                        foundUser.details = userDetails;

                                        return resolve(foundUser);
                                    }
                                )
                                .catch(
                                    (err) => reject(err)
                                );
                        }
                    );
            }
        );

        return promise;
    },
    create(user) {
        let promise = new Promise(
            (resolve, reject) => {
                User.create(user)
                    .exec((err, createdUser) => {
                        if (err) {

                            return reject(err);
                        }

                        return resolve(createdUser);
                    });
            });

        return promise;
    },
    update(queryKey, updatedUser) {
        let promise = new Promise((resolve, reject) => {
            User.findOne(queryKey)
                .exec((err, user) => {
                    if (err) {

                        return reject(err);
                    }

                    if (!user) {

                        return reject();
                    }

                    user = Object.assign(user, updatedUser);

                    user.save(
                        (err) => {
                            if (err) {

                                return reject(err);
                            }

                            return resolve(user);
                        }
                    );
                });
        });

        return promise;
    },
    encryptPassword(password) {
        let promise = new Promise(
            (resolve, reject) => {
                bcryptjs.genSalt(10, (err, salt) => {
                    bcryptjs.hash(password, salt,
                        (err, hash) => {
                            if (err) {

                                return reject(err);
                            }

                            return resolve(hash);
                        });
                });
            }
        );

        return promise;
    },
    generateToken() {
        let buffer = crypto.randomBytes(sails.config.application.tokenLength);

        return buffer.toString('hex');
    }
};

module.exports = UserService;