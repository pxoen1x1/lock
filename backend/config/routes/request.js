'use strict';

let requestRoutes = {
    'GET /api/user/requests': {
        controller: 'RequestController',
        action: 'getAllUserRequests'
    },
    'GET /api/request/:request': {
        controller: 'RequestController',
        action: 'getRequestById'
    },
    'POST /api/user/request': {
        controller: 'RequestController',
        action: 'create'
    }
};

module.exports.routes = requestRoutes;