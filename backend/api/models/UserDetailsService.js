/**
 * UserDetailsService.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let UserDetailsService = {
    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'user_details_service',

    attributes: {
        userDetails: {
            model: 'UserDetails',
            columnName: 'user_details_id'
        },
        services: {
            model: 'Service',
            columnName: 'service_id'
        }
    }
};

module.exports = UserDetailsService;

