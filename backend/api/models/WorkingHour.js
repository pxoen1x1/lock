/**
 * WorkingHour.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'working_hours',

    attributes: {
        timeFrom: {
            type: 'datetime',
            columnName: 'time_from'
        },
        timeTo: {
            type: 'datetime',
            columnName: 'time_to'
        },

        userDetail: {
            model: 'UserDetail',
            unique: true,
            columnName: 'user_details_id'
        }
    }
};

