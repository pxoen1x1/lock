/**
 * PriceList.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'price_list',

    attributes: {
        price: {
            type: 'number'
        },

        serviceProcedureId: {
            model: 'ServiceProcedure',
            columnName: 'service_procedure_id'
        },
        serviceProviderProfileId: {
            model: 'ServiceProviderProfile',
            columnName: 'service_provider_profile_id'
        }
    }
};

