'use strict';
/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
let bcryptjs = require('bcryptjs');

module.exports = {

    attributes: {
        firstName: {
            type: 'string',
            required: true
        },
        lastName: {
            type: 'string',
            required: true
        },
        email: {
            type: 'email',
            unique: true,
            email: true,
            required: true
        },
        password: {
            type: 'string',
            required: true
        },
        fullName: function () {

            return `${this.firstName} ${this.lastName}`;
        },

        toJSON: function () {
            let user = this.toObject();
            delete user.password;

            return user;
        },

        beforeCreate: function (user, next) {
            bcryptjs.genSalt(10, function (err, salt) {
                bcryptjs.hash(user.password, salt, (err, hash) => {
                    if (err) {

                        next(err);
                    } else {
                        user.password = hash;

                        next(null, user);
                    }
                });
            });
        }
    }
};

