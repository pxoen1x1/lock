/**
 * ServiceProviderProfileServiceType.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let ServiceProviderProfileServiceType = {
    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'service_provider_profiles_service_types',

    attributes: {
        serviceProviderProfileId: {
            model: 'ServiceProviderProfile',
            columnName: 'service_provider_profile_id'
        },
        serviceTypeId: {
            model: 'ServiceType',
            columnName: 'service_type_id'
        }
    }
};

module.exports = ServiceProviderProfileServiceType;

