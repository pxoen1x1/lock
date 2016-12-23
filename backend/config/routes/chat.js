'use strict';

let chatRoutes = {
    'GET /api/specialist/chats/:chatId': {
        controller: 'ChatController',
        action: 'getSpecialistChat'
    },
    'GET /api/client/requests/:requestId/chats': {
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
    'POST /api/client/requests/:requestId/chats': {
        controller: 'ChatController',
        action: 'createChat'
    },
    'POST /api/chats/:chatId/subscribe': {
        controller: 'ChatController',
        action: 'subscribeToChat'
    }
};

module.exports.routes = chatRoutes;