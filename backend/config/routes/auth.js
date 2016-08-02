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
    'POST /api/user/password/forgot': {
        controller: 'AuthController',
        action: 'createResetPasswordToken'
    },
    'POST /api/login': {
        controller: 'AuthController',
        action: 'login'
    },
    'POST /api/logout': {
        controller: 'AuthController',
        action: 'logout'
    },
    [`POST ${appConfig.application.urls.passwordResetRequest}/:token`]: {
        controller: 'AuthController',
        action: 'resetPassword'
    }
};

module.exports.routes = authRoutes;