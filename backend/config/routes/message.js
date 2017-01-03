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
    'POST /api/chats/:chatId/offer': {
        controller: 'MessageController',
        action: 'createOffer'
    },
    'POST /api/chats/:chatId/messages/file' : {
        controller: 'MessageController',
        action: 'uploadFile'
    },
    'POST /api/messages/:messageId/translate' : {
        controller: 'MessageController',
        action: 'translateMessage'
    }
};

module.exports.routes = messageRoutes;