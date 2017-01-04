/* global Message, Chat, Language, TranslatedMessage, TranslatorService */

'use strict';

let MessageService = {
    getMessages(criteria, sorting, pagination) {

        return Message.find(criteria)
            .sort(sorting)
            .populateAll()
            .paginate(pagination)
            .then(
                (messages) => messages
            );
    },
    getMessagesCount(criteria) {

        return Message.count(criteria)
            .then(
                (count) => count
            );
    },
    create(chat, message) {

        return Chat.findOneById(chat.id)
            .then(
                (chat) => {
                    if (!chat) {

                        return Promise.reject(new Error('Chat is not found.'));
                    }

                    message.chat = chat.id;

                    return Message.create(message);
                }
            )
            .then(
                (createdMessage) => Message.findOneById(createdMessage.id).populateAll()
            );
    },
    translateMessage(message, lang) {

        return TranslatedMessage.findOne({message: message.id, language: lang.id})
            .then(
                (translatedMessage) => {

                    return translatedMessage || this._translateMessage(message, lang);
                }
            );
    },
    _translateMessage(message, lang){

        return Promise.all([
            Message.findOneById(message.id),
            Language.findOneById(lang.id)
        ])
            .then(
                (values) => {
                    let foundMessage = values[0];
                    let language = values[1];

                    return TranslatorService.translateText(foundMessage.message, language.code);
                }
            )
            .then(
                (translatedText) => {
                    let translatedMessage = {
                        translated: translatedText,
                        message: message,
                        language: lang
                    };

                    return TranslatedMessage.create(translatedMessage);
                }
            );
    }
};

module.exports = MessageService;