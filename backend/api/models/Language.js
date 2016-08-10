/**
 * Language.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  tableName: 'languages',

  attributes: {
    name: {
      type: 'string'
    },

    userDetails: {
      collection: 'UserDetail',
      via: 'languages'
    }
  }
};

