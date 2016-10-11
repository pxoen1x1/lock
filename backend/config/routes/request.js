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
        action: 'updateRequest'
    }
};

module.exports.routes = requestRoutes;