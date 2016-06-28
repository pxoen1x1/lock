'use strict';
/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
let bcryptjs = require('bcryptjs');

let User = {
    tableName: 'users',

    attributes: {
        firstName: {
            type: 'string',
            required: true,
            columnName: 'first_name'
        },
        lastName: {
            type: 'string',
            required: true,
            columnName: 'last_name'
        },
        gender: {
            type: 'string',
            enum: ['male', 'female']
        },
        email: {
            type: 'email',
            unique: true,
            email: true,
            required: true
        },
        portrait: {
            type: 'binary'
        },
        phoneNumber: {
            type: 'number',
            unique: true,
            columnName: 'phone_number'
        },
        password: {
            type: 'string',
            required: true
        },
        role: {
            type: 'int',
            required: true
        },

        customerProfile: {
            collection: 'customerProfile',
            via: 'userId'
        },
        serviceProviderProfile: {
            collection: 'serviceProviderProfile',
            via: 'userId'
        },

        fullName() {

            return `${this.firstName} ${this.lastName}`;
        },

        toJSON() {
            let user = this.toObject();

            user.fullName = this.fullName();

            delete user.password;

            return user;
        }
    },

    beforeCreate: function (user, next) {
        bcryptjs.genSalt(10, (err, salt) => {
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
};

module.exports = User;

