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
        photo: {
            type: 'string'
        },
        title: {
            type: 'string',
            required: true
        },
        owner: {
            model: 'User',
            required: true,
            columnName: 'owner_id'
        },
        request: {
            model: 'Request',
            required: true,
            columnName: 'request_id'
        },

        message: {
            collection: 'Message',
            via: 'chat'
        },
        members: {
            collection: 'User',
            via: 'chatMembers',
            dominant: true,
            required: true,
        }
    }
};

module.exports = Chat;

