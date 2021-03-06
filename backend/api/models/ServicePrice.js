/**
 * ServicePrice.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'service_prices',

    attributes: {
        price: {
            type: 'float'
        },
        serviceName: {
            type: 'string',
            columnName: 'service_name'
        },

        userDetail: {
            model: 'UserDetail',
            columnName: 'user_details_id'
        }
    }
};
