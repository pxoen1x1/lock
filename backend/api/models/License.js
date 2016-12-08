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
        date: {
            type: 'date',
            required: true
        },

        state: {
            model: 'State',
            required: true,
            columnName: 'state_id'
        },
        userDetail: {
            model: 'UserDetail',
            columnName: 'user_details_id'
        },
        group: {
            model: 'Group',
            columnName: 'group_id'
        }
    }
};

module.exports = License;
