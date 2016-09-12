/*global sails, UserService*/

/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

let waterlock = require('waterlock');

let User = {
    tableName: 'users',

    attributes: waterlock.models.user.attributes({
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
        ssn: {
            type: 'string',
            unique: true,
            is: /^\d{3}-?\d{2}-?\d{4}$/
        },
        isEnabled: {
            type: 'boolean',
            defaultsTo() {

                return !sails.config.application.emailVerificationEnabled;
            },
            columnName: 'is_enabled'
        },
        isEmailConfirmed: {
            type: 'boolean',
            defaultsTo() {

                return !sails.config.application.emailVerificationEnabled;
            },
            columnName: 'is_email_confirmed'
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
        emailConfirmationToken: {
            type: 'string',
            defaultsTo() {
                if (sails.config.application.emailVerificationEnabled) {

                    return UserService.generateToken();
                }
            },
            columnName: 'email_confirmation_token'
        },

        address: {
            collection: 'Address',
            via: 'user'
        },
        userDetail: {
            collection: 'UserDetail',
            via: 'user'
        },
        requestCreators: {
            collection: 'Request',
            via: 'creator'
        },
        requestExecutors: {
            collection: 'Request',
            via: 'executor'
        },
        chatOwners: {
            collection: 'Chat',
            via: 'owner'
        },
        chatContacts: {
            collection: 'Chat',
            via: 'contact'
        },
        messageSenders: {
            collection: 'Message',
            via: 'sender'
        },

        fullName() {

            return `${this.firstName} ${this.lastName}`;
        },

        toJSON() {
            let user = this.toObject();

            user.fullName = this.fullName();

            delete user.emailConfirmationToken;

            return user;
        }
    }),

    beforeCreate: waterlock.models.user.beforeCreate,
    beforeUpdate: waterlock.models.user.beforeUpdate
};

module.exports = User;