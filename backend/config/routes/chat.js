'use strict';

let chatRoutes = {
    'GET /api/client/request/:request/chats': {
        controller: 'ChatController',
        action: 'getClientChats'
    },
    'POST /api/request/:request/chats': {
        controller: 'ChatController',
        action: 'createChat'
    }
};

module.exports.routes = chatRoutes;