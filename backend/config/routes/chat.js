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
    'GET /api/specialist/requests/:requestId/chat': {
        controller: 'ChatController',
        action: 'getSpecialistChatByRequest'
    },
    'POST /api/client/request/:requestId/chats': {
        controller: 'ChatController',
        action: 'createChat'
    }
};

module.exports.routes = chatRoutes;