'use strict';

let userRoutes = {
    'GET /api/user': {
        controller: 'UserController',
        action: 'getCurrentUser'
    },
    'POST /api/user': {
        controller: 'AuthController',
        action: 'register'
    },
    'PUT /api/user': {
        controller: 'UserController',
        action: 'updateUser'
    },
    'PUT /api/user/:id': {
        controller: 'UserController',
        action: 'updateUser'
    }
};

module.exports.routes = userRoutes;
