/**
 * GroupInvitation.js
 *
 * @description :: Holds all invitations to group.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let GroupInvitation = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'invitations',

    attributes: {
        token: {
            type: 'string',
            required: true
        },
        expiration: {
            type: 'datetime',
            required: true
        },

        user: {
            model: 'User',
            columnName: 'user_id'
        },
        group: {
            model: 'Group',
            columnName: 'group_id'
        }
    }
};

module.exports = GroupInvitation;

