/* global Message, Chat */

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
                    message.recipient = message.sender !== chat.client ? chat.client : chat.specialist;

                    return Message.create(message);
                }
            )
            .then(
                (createdMessage) => Message.findOneById(createdMessage.id).populateAll()
            );
    }
};

module.exports = MessageService;