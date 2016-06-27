/**
 * ServiceProviderProfile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let ServiceProviderProfile = {
    tableName: 'service_provider_profiles',
    
    attributes: {
        firmName: {
            type: 'string',
            columnName: 'firm_name'
        },
        ssn: {
            type: 'number',
            unique: true
        },
        itin: {
            type: 'number',
            unique: true,
            required: true
        },
        workingHistory: {
            type: 'string',
            columnName: 'working_history'
        },
        resume: {
            type: 'string'
        },
        subscriptionType: {
            type: 'boolean',
            required: true,
            columnName: 'subscription_type'
        },
        userId: {
            model:'user',
            unique: true,
            columnName: 'user_id'
        }
    }
};

module.exports = ServiceProviderProfile;

