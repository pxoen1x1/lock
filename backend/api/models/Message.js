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
        text: {
            type: 'string',
            required: true
        },
        isOffer: {
            type: 'boolean',
            defaultsTo: false
        },
        isAgreement: {
            type: 'boolean',
            defaultsTo: false
        },
        isRead: {
            type: 'boolean',
            defaultsTo: false
        },

        owner: {
            model: 'User',
            required: true,
            columnName: 'owner_id'
        },
        recipient: {
            model: 'User',
            required: true,
            columnName: 'recipient_id'
        },
        chat: {
            model: 'Chat',
            required: true,
            columnName: ' chat_id'
        }
    }
};

module.exports = Message;

