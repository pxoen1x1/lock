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
    'GET /api/merchant': {
        controller: 'UserController',
        action: 'getMerchant'
    },
    'PUT /api/merchant': {
        controller: 'UserController',
        action: 'updateMerchant'
    },
    'POST /api/userpayment': {
        controller: 'UserController',
        action: 'setCurrentUserPayment'
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
