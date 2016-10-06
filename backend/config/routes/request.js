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
    'GET /api/specialist/requests/all': {
        controller: 'RequestController',
        action: 'getAllSpecialistRequests'
    },
    'GET /api/specialist/requests/current': {
        controller: 'RequestController',
        action: 'getCurrentSpecialistRequests'
    },
    'PUT /api/client/requests/:requestId': {
        controller: 'RequestController',
        action: 'updateRequest'
    }
};

module.exports.routes = requestRoutes;