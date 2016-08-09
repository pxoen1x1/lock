/**
 * Procedure.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let Procedure = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'procedures',

    attributes: {
        name: {
            type: 'string'
        },

        service: {
            model: 'Service',
            columnName: 'service_id'
        }
    }
};

module.exports = Procedure;

