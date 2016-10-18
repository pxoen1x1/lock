'use strict';

let requestRoutes = {
    'GET /api/client/requests': {
        controller: 'RequestController',
        action: 'getAllClientRequests'
    },
    'GET /api/specialist/requests': {
        controller: 'RequestController',
        action: 'getSpecialistRequests'
    },
    'GET /api/specialist/requests/new': {
        controller: 'RequestController',
        action: 'getSpecialistNewRequests'
    },
    'GET /api/client/requests/:requestId': {
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
    'PUT /api/client/requests/:requestId': {
        controller: 'RequestController',
        action: 'confirmOffer'
    },
    'PUT /api/requests/:requestId/status': {
        controller: 'RequestController',
        action: 'changeStatus'
    }
};

module.exports.routes = requestRoutes;