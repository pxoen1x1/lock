/**
 * UserDetails.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let UserDetails = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'user_details',

    attributes: {

        services: {
            collection: 'Service',
            via: 'userDetails',
            dominant: true,
            through: 'userdetailsservice'
        }
    }
};


module.exports = UserDetails;

