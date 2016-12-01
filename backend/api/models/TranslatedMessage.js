/**
 * TranslatedMessage.js
 *
 * @module      :: Model
 * @description ::  Holds all translated messages.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
'use strict';

let TranslatedMessage = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'translated_messages',

    attributes: {
        translated: {
            type: 'string',
            required: true
        },

        message: {
            model: 'Message',
            required: true,
            columnName: 'message_id'
        },
        language: {
            model: 'Language',
            required: true,
            columnName: 'language_id'
        }
    }
};

module.exports = TranslatedMessage;
