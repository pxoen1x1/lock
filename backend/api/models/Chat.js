/**
 * Chat.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let Chat = {
    tableName: 'chats',

    attributes: {
        owner: {
            model: 'User',
            required: true,
            columnName: 'owner_id'
        },
        members: {
            collection: 'User',
            via: 'chatMembers',
            dominant: true,
            required: true,
        },
        request: {
            model: 'Request',
            required: true,
            columnName: 'request_id'
        },

        message: {
            collection: 'Message',
            via: 'chat'
        }
    }
};

module.exports = Chat;

