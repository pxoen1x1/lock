/**
 * Auth
 *
 * @module      :: Model
 * @description :: Holds all authentication methods for a User
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

let waterlock = require('waterlock');

let Auth = {

    attributes: waterlock.models.auth.attributes({
        email: {
            type: 'string',
            unique: true,
            email: true,
            required: true
        },
        password: {
            type: 'string',
            required: true,
            minLength: '6'
        },

        toJSON() {
            let auth = this.toObject();

            delete auth.password;
            delete auth.resetToken;

            return auth;
        }
    }),

    beforeCreate: waterlock.models.auth.beforeCreate,
    beforeUpdate: waterlock.models.auth.beforeUpdate
};

module.exports = Auth;
