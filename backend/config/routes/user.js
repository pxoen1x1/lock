'use strict';

let userRoutes = {
    'GET /api/user': {
        controller: 'UserController',
        action: 'getCurrentUser'
    },
    'GET /api/userpayment': {
        controller: 'UserController',
        action: 'getCurrentUserPayment'
    },
    'POST /api/userpayment': {
        controller: 'UserController',
        action: 'setCurrentUserPayment'
    },
    'GET /api/merchantentity': {
        controller: 'UserController',
        action: 'getMerchantEntity'
    },
    'PUT /api/merchantentity': {
        controller: 'UserController',
        action: 'updateMerchantEntity'
    },
    'GET /api/users/:id': {
        controller: 'UserController',
        action: 'getUserById'
    },
    'PUT /api/user': {
        controller: 'UserController',
        action: 'updateUser'
    }
};

module.exports.routes = userRoutes;
