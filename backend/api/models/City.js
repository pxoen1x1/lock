/**
 * City.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let City = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'cities',

    attributes: {
        city: {
            type: 'string',
            required: true
        },
        zip: {
            type: 'number'
        },
        lat: {
            type: 'float'
        },
        lng: {
            type: 'float'
        },

        stateId: {
            model: 'state',
            columnName: 'state_id'
        },
        addresses: {
            collection: 'address',
            via: 'cityId'
        }
    }
};

module.exports = City;
