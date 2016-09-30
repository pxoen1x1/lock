/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let Message = {
    tableName: 'messages',

    attributes: {
        message: {
            type: 'text',
            required: true
        },
        type: {
            type: 'integer',
            defaultsTo: 1
        },
        isRead: {
            type: 'boolean',
            defaultsTo: false,
            columnName: 'is_read'
        },

        sender: {
            model: 'User',
            required: true,
            columnName: 'sender_id'
        },
        recipient: {
            model: 'User',
            required: true,
            columnName: 'recipient_id'
        },
        chat: {
            model: 'Chat',
            required: true,
            columnName: 'chat_id'
        }
    }
};

module.exports = Message;

