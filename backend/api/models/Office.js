/**
 * Office.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'offices',

    attributes: {
        phoneNumber: {
            type: 'number',
            columnName: 'phone_number'
        },
        faxNumber: {
            type: 'number',
            columnName: 'fax_number'
        },
        email: {
            type: 'string',
            email: true
        }
    }
};

