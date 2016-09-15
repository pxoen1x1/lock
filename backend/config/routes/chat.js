'use strict';

let chatRoutes = {
    'GET /api/client/request/:request/chats': {
        controller: 'ChatController',
        action: 'getClientChats'
    },
    'POST /api/request/:request/chats': {
        controller: 'ChatController',
        action: 'createChat'
    },
    'POST /api/chats/:chat/messages': {
        controller: 'MessageController',
        action: 'create'
    }
};

module.exports.routes = chatRoutes;