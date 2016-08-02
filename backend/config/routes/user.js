'use strict';

let userRoutes = {
    'GET /api/user': {
        controller: 'UserController',
        action: 'getUser'
    },
    'POST /api/user': {
        controller: 'UserController',
        action: 'createUser'
    },
    'PUT /api/user/:id': {
        controller: 'UserController',
        action: 'updateUser'
    }
};

module.exports.routes = userRoutes;
