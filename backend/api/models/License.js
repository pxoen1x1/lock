/**
 * License.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  tableName: 'licenses',

  attributes: {
    number: {
      type: 'number',
      date: 'date'
    },

    serviceProviderProfileId: {
      model: 'ServiceProviderProfile',
      columnName: 'service_provider_profile_id'
    }
  }
};

