'use strict';

let messageRoutes = {
    'GET /api/chats/:chat/messages': {
        controller: 'MessageController',
        action: 'getMessages'
    },
    'POST /api/chats/:chat/messages': {
        controller: 'MessageController',
        action: 'create'
    }
};

module.exports.routes = messageRoutes;