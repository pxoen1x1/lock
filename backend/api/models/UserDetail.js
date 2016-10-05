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
        isPro: {
            type: 'boolean',
            required: true,
            defaultsTo: false,
            columnName: 'is_pro'
        },
        latitude: {
            type: 'float',
            required: true,
            is: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]*)?))$/
        },
        longitude: {
            type: 'float',
            required: true,
            is: /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/
        },
        rating: {
            type: 'float',
            min: 1,
            max: 5
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

        serviceTypes: {
            collection: 'ServiceType',
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
