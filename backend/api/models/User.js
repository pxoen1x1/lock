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
        birthday: {
            type: 'date'
        },
        email: {
            type: 'string',
            unique: true,
            email: true,
            required: true
        },
        ssn: {
            type: 'string',
            unique: true,
            is: /^\d{3}-?\d{2}-?\d{4}$/
        },
        enabled: {
            type: 'boolean',
            defaultsTo() {

                return !sails.config.application.emailVerificationEnabled;
            }
        },
        emailConfirmed: {
            type: 'boolean',
            defaultsTo() {

                return !sails.config.application.emailVerificationEnabled;
            }
        },
        token: {
            type: 'string',
            defaultsTo() {
                if (sails.config.application.emailVerificationEnabled) {

                    return UserService.generateToken();
                }
            }
        },
        resetPasswordToken: {
            type: 'string'
        },
        resetPasswordExpires: {
            type: 'datetime'
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

        fullName() {

            return `${this.firstName} ${this.lastName}`;
        },

        toJSON() {
            let user = this.toObject();

            user.fullName = this.fullName();

            delete user.password;
            delete user.token;
            delete user.resetPasswordToken;
            delete user.resetPasswordExpires;

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
    },
    beforeUpdate(user, next) {
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
