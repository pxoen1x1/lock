'use strict';

let requestRoutes = {
    'GET /api/client/requests': {
        controller: 'RequestController',
        action: 'getAllClientRequests'
    },
    'GET /api/client/requests/:request': {
        controller: 'RequestController',
        action: 'getClientRequestById'
    },
    'GET /api/specialists/find': {
        controller: 'UserController',
        action: 'findServiceProviders'
    },
    'POST /api/client/requests': {
        controller: 'RequestController',
        action: 'create'
    },
    'POST /api/client/requests/:request/feedback': {
        controller: 'RequestController',
        action: 'createFeedback'
    }
};

module.exports.routes = requestRoutes;