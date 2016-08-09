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
        user: {
            model: 'User',
            unique: true,
            columnName: 'user_id'
        },

        services: {
            collection: 'Service',
            via: 'userDetails',
            dominant: true
        },
        license: {
            collection: 'License',
            via: 'userDetail'
        }
    }
};

module.exports = UserDetail;
