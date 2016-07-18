'use strict';

let bcryptjs = require('bcryptjs');
let crypto = require('crypto');

let UserService = {
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