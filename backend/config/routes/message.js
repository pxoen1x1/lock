'use strict';

let messageRoutes = {
    'GET /api/chats/:chatId/messages': {
        controller: 'MessageController',
        action: 'getMessages'
    },
    'POST /api/chats/:chatId/messages': {
        controller: 'MessageController',
        action: 'createMessage'
    },
    'POST /api/chats/:chatId/messages/file' : {
        controller: 'MessageController',
        action: 'uploadFile'
    },
    'POST /api/messages/:messageId/translate' : {
        controller: 'MessageController',
        action: 'getTranslatedMessage'
    }
};

module.exports.routes = messageRoutes;