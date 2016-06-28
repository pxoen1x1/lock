/**
 * ServiceProcedure.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let ServiceProcedure = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'service_procedures',

    attributes: {
        name: {
            type: 'string'
        },

        serviceTypeId: {
            model: 'ServiceType',
            columnName: 'service_type_id'
        },
        priceList: {
            collection: 'PriceList',
            via: 'serviceProcedureId'
        }
    }
};

module.exports = ServiceProcedure;

