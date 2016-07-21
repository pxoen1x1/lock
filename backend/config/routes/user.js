'use strict';
let appConfig = require('../application');

let userRoutes = {
    'GET /api/user': {
        controller: 'UserController',
        action: 'getUser'
    },
    [`GET ${appConfig.application.urls.emailConfirmation}`]: {
        controller: 'UserController',
        action: 'confirmEmail'
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
