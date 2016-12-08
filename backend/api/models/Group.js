/**
 * Group.js
 *
 * @description :: This is the base group model.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
'use strict';

let Group = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'groups',

    attributes: {
        title: {
            type: 'string',
            required: true
        },

        admin: {
            model: 'User',
            columnName: 'admin_id'
        },

        members: {
            collection: 'User',
            via: 'groupMembers'
        },
        licenses: {
            collection: 'License',
            via: 'group'
        }
    }
};

module.exports = Group;
