'use strict';

let appConfig = require('../application');

let authRoutes = {
    [`GET ${appConfig.application.urls.emailConfirmation}`]: {
        controller: 'AuthController',
        action: 'confirmEmail'
    }
};

module.exports.routes = authRoutes;