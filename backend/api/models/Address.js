/**
 * Address.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'addresses',

    attributes: {
        address: {
            type: 'string',
            required: true
        },
        zip: {
            type: 'number'
        },

        cityId: {
            model: 'city',
            columnName: 'city_id'
        },
        customerProfileId: {
            model: 'CustomerProfile',
            columnName: 'customer_profile_id'
        }
    }
};
