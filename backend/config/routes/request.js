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
    'POST /api/client/request': {
        controller: 'RequestController',
        action: 'create'
    }
};

module.exports.routes = requestRoutes;