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
    'GET /api/specialist/requests/:requestId': {
        controller: 'RequestController',
        action: 'getSpecialistRequestById'
    },
    'GET /api/specialist/requests/status/check': {
        controller: 'RequestController',
        action: 'checkSpecialistRequestsStatus'
    },
    'GET /api/specialists/find': {
        controller: 'UserController',
        action: 'findServiceProviders'
    },
    'GET /api/group/requests': {
        controller: 'RequestController',
        action: 'getGroupRequests'
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