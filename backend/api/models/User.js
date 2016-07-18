'use strict';
/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let User = {
    tableName: 'users',

    attributes: {
        id: {
            type: 'integer',
            unique: true,
            primaryKey: true
        },
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
            type: 'string',
            unique: true,
            email: true,
            required: true
        },
        enabled: {
            type: 'boolean',
            defaultsTo() {

                return !sails.config.application.customerVerificationEnabled;
            }
        },
        emailConfirmed: {
            type: 'boolean',
            defaultsTo() {

                return !sails.config.application.customerVerificationEnabled;
            }
        },
        token: {
            type: 'string',
            defaultsTo() {
                if (sails.config.application.customerVerificationEnabled) {

                    return UserService.generateToken();
                }
            }
        },
        portrait: {
            type: 'string'
        },
        phoneNumber: {
            type: 'string',
            required: true,
            unique: true,
            columnName: 'phone_number'
        },
        password: {
            type: 'string',
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
            delete user.token;

            return user;
        }
    },

    beforeCreate(user, next) {
        UserService.encryptPassword(user.password)
            .then(
                (encryptedPassword) => {
                    user.password = encryptedPassword;

                    next(null, user);
                }
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    next(err);
                }
            );
    }
};

module.exports = User;
