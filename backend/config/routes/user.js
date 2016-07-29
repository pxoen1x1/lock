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
    [`GET ${appConfig.application.urls.passwordResetRequest}/:token`]: {
        controller: 'UserController',
        action: 'openPasswordResetPage'
    },
    'POST /api/user': {
        controller: 'UserController',
        action: 'createUser'
    },
    'POST /api/user/password/forgot': {
        controller: 'UserController',
        action: 'createResetPasswordToken'
    },
    [`POST ${appConfig.application.urls.passwordResetRequest}/:token`]: {
        controller: 'UserController',
        action: 'resetPassword'
    },
    'PUT /api/user/:id': {
        controller: 'UserController',
        action: 'updateUser'
    }
};

module.exports.routes = userRoutes;
