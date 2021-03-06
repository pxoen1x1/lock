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
            type: 'string'
        },
        zip: {
            type: 'string',
            is: /^[0-9]{5}(-[0-9]{4})?$/
        },

        city: {
            model: 'city',
            columnName: 'city_id'
        },
        state: {
            model: 'state',
            columnName: 'state_id'
        },
        user: {
            model: 'user',
            unique: true,
            columnName: 'user_id'
        }
    }
};

module.exports = Address;
