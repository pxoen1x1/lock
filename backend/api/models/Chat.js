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
        isAcceptedByClient: {
            type: 'boolean',
            defaultsTo: false,
            columnName: 'is_accepted_by_client'
        },
        isAcceptedBySpecialist: {
            type: 'boolean',
            defaultsTo: false,
            columnName: 'is_accepted_by_specialist'
        },

        owner: {
            model: 'User',
            required: true,
            columnName: 'owner_id'
        },
        contact: {
            model: 'User',
            columnName: 'contact_id'
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

