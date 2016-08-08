/**
 * Service.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let Service = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'services',

    attributes: {
        name: {
            type: 'string'
        },

        userDetails: {
            collection: 'UserDetails',
            via: 'service',
            through: 'userdetailsservice'
        }
    }
};

module.exports = Service;

