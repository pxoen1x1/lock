/**
 * ServiceType.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let ServiceType = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'service_types',

    attributes: {
        name: {
            type: 'string'
        },

        userDetails: {
            collection: 'UserDetail',
            via: 'serviceTypes'
        },
        requests: {
            collection: 'Request',
            via: 'serviceType'
        }
    }
};

module.exports = ServiceType;
