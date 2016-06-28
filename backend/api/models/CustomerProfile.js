'use strict';
/**
 * CustomerProfile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let CustomerProfile = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'customer_profiles',

    attributes: {
        userId: {
            model: 'user',
            unique: true,
            columnName: 'user_id'
        },

        addresses: {
            collection: 'Address',
            via: 'customerProfileId'
        },
        creditCards: {
            collection: 'CreditCard',
            via: 'customerProfileId'
        }
    }
};

module.exports = CustomerProfile;

