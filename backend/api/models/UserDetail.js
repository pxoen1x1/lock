/**
 * UserDetail.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let UserDetail = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'user_details',

    attributes: {
        isPaid: {
            type: 'boolean',
            required: true,
            columnName: 'is_paid'
        },

        user: {
            model: 'User',
            unique: true,
            columnName: 'user_id'
        },

        license: {
            collection: 'License',
            via: 'userDetail'
        },
        servicePrices: {
            collection: 'ServicePrice',
            via: 'userDetail'
        },
        workingHours: {
            collection: 'WorkingHour',
            via: 'userDetail'
        },

        services: {
            collection: 'Service',
            via: 'userDetails',
            dominant: true
        },
        languages: {
            collection: 'Language',
            via: 'userDetails',
            dominant: true
        }
    }
};

module.exports = UserDetail;
