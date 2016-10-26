/* global sails */

/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

const TYPE = sails.config.messages.TYPES;

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
        cost: {
            type: 'float',
            is: /^\d*(\.\d{1,2})?$/
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
    },

    beforeValidate(message, next) {
        let messageType = parseInt(message.type, 10);

        if (messageType === TYPE.OFFER && !message.cost) {
            let errorText = sails.__('Cost must be defined for offers.');

            return next(new TypeError(errorText));
        }

        next(null, message);
    }
};

module.exports = Message;

