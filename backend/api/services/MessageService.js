/* global Message */

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
    }
};

module.exports = MessageService;