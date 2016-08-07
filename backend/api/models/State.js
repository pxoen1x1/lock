/**
 * State.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let State = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'states',

    attributes: {
        state: {
            type: 'string',
            required: true
        },
        code: {
            type: 'string'
        },

        cities: {
            collection: 'city',
            via: 'state'
        },
        addresses: {
            collection: 'address',
            via: 'city'
        }
    }
};

module.exports = State;