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
        isSpAgreed: {
            type: 'boolean',
            defaultsTo: false,
            columnName: 'is_sp_agreed'
        },

        members: {
            collection: 'User',
            via: 'groupMembers'
        },
        licenses: {
            collection: 'License',
            via: 'group'
        },
        invitations: {
            collection: 'GroupInvitation',
            via: 'group'
        }
    }
};

module.exports = Group;
