/**
 * Location.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let Location = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'locations',

    attributes: {
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
        address: {
            type: 'string'
        },

        request: {
            collection: 'Request',
            via: 'location'
        }
    }
};

module.exports = Location;

