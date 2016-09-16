'use strict';

let appConfig = require('../application');

let authRoutes = {

    [`GET ${appConfig.application.urls.emailConfirmation}`]: {
        controller: 'AuthController',
        action: 'confirmEmail'
    },
    [`GET ${appConfig.application.urls.passwordResetRequest}/:token`]: {
        controller: 'AuthController',
        action: 'openPasswordResetPage'
    },
    'POST /api/user': {
        controller: 'AuthController',
        action: 'register'
    },
    'POST /auth/password/reset': {
        controller: 'AuthController',
        action: 'createResetAuthToken'
    },
    [`POST ${appConfig.application.urls.passwordResetRequest}/:token`]: {
        controller: 'AuthController',
        action: 'resetPassword'
    }
};

module.exports.routes = authRoutes;