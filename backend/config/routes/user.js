'use strict';

let userRoutes = {
    'GET /api/user': {
        controller: 'UserController',
        action: 'getCurrentUser'
    },
    'GET /api/users/:user/feedbacks': {
        controller: 'UserController',
        action: 'getUserFeedbacks'
    },
    'POST /api/user': {
        controller: 'AuthController',
        action: 'register'
    },
    'PUT /api/user/:id': {
        controller: 'UserController',
        action: 'updateUser'
    }
};

module.exports.routes = userRoutes;
