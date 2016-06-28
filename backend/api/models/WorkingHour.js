/**
 * WorkingHour.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let WorkingHour = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'working_hours',

    attributes: {
        weekday: {
            type: 'string',
            required: true
        },
        timeFrom: {
            type: 'integer',
            required: true,
            columnName: 'time_from'
        },
        timeTo: {
            type: 'integer',
            required: true,
            columnName: 'time_to'
        },

        officeId: {
            model: 'Office',
            columnName: 'office_id'
        }
    }
};

module.exports = WorkingHour;
