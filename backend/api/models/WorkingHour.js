/**
 * WorkingHour.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let WorkingHour = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'workingHours',

    attributes: {
        weekday: {
            type: 'string',
            required: true
        },
        timeFrom: {
            type: 'integer',
            required: true
        },
        timeTo: {
            type: 'integer',
            required: true
        }
    }
};

module.exports = WorkingHour;

