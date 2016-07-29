/**
 * Address.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let Address = {
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
        userId: {
            model: 'user',
            columnName: 'user_id'
        },
        officeId: {
            model: 'office',
            columnName: 'office_id'
        }
    }
};

module.exports = Address;
