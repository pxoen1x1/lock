'use strict';

let chatRoutes = {
    'GET /api/specialist/chat/:chatId': {
        controller: 'ChatController',
        action: 'getSpecialistChat'
    },
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
    },
    'POST /api/chat/:chatId/subscribe': {
        controller: 'ChatController',
        action: 'subscribeToChat'
    }
};

module.exports.routes = chatRoutes;