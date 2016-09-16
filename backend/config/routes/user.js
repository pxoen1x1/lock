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
    'PUT /api/user': {
        controller: 'UserController',
        action: 'updateUser'
    }
};

module.exports.routes = userRoutes;
