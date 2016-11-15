'use strict';

let messageRoutes = {
    'GET /api/chats/:chat/messages': {
        controller: 'MessageController',
        action: 'getMessages'
    },
    'POST /api/chats/:chat/messages': {
        controller: 'MessageController',
        action: 'createMessage'
    },
    'POST /api/chats/:chat/messages/file' : {
        controller: 'MessageController',
        action: 'uploadFile'
    }
};

module.exports.routes = messageRoutes;