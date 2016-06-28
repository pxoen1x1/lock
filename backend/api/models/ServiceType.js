/**
 * ServiceType.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let ServiceType = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'service_types',

    attributes: {
        name: {
            type: 'string',
            required: true
        },

        serviceProviderProfiles: {
            collection: 'ServiceProviderProfile',
            via: 'serviceTypeId',
            through: 'serviceproviderprofileservicetype'
        },
        serviceProcedures: {
            collection: 'ServiceProcedure',
            via: 'serviceTypeId'
        }
    }
};

module.exports = ServiceType;

