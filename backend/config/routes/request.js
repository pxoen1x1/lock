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
        action: 'createRequest'
    },
    'POST /api/client/requests/:request/feedback': {
        controller: 'RequestController',
        action: 'createFeedback'
    },
    'GET /api/specialist/requests': {
        controller: 'RequestController',
        action: 'getAllSpecialistRequests'
    },
    'PUT /api/client/requests/:requestId': {
        controller: 'RequestController',
        action: 'updateRequest'
    }
};

module.exports.routes = requestRoutes;