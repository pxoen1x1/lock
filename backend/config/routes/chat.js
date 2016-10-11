'use strict';

let chatRoutes = {
    'GET /api/client/request/:requestId/chats': {
        controller: 'ChatController',
        action: 'getClientChats'
    },
    'GET /api/specialist/chats': {
        controller: 'ChatController',
        action: 'getSpecialistChats'
    },
    'POST /api/client/request/:requestId/chats': {
        controller: 'ChatController',
        action: 'createChat'
    }
};

module.exports.routes = chatRoutes;