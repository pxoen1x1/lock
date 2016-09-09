'use strict';

let chatRoutes = {
    'GET /api/request/:request/chats': {
        controller: 'ChatController',
        action: 'getChats'
    },
    'POST /api/request/:request/chats': {
        controller: 'ChatController',
        action: 'create'
    }
};

module.exports.routes = chatRoutes;