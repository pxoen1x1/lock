/**
 * License.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let License = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'licenses',

    attributes: {
        number: {
            type: 'string',
            required: true
        },
        state: {
            type: 'string',
            required: true
        },
        date: {
            type: 'date',
            required: true
        },

        userDetail: {
            model: 'UserDetail',
            unique: true,
            columnName: 'user_details_id'
        }
    }
};

module.exports = License;
