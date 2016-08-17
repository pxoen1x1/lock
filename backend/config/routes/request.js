'use strict';

let requestRoutes = {
    'GET /api/user/requests': {
        controller: 'RequestController',
        action: 'getAllUserRequests'
    },
    'POST /api/user/request': {
        controller: 'RequestController',
        action: 'create'
    }
};

module.exports.routes = requestRoutes;