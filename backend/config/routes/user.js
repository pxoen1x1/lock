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
    'GET /api/customer': {
        controller: 'UserController',
        action: 'getCustomer'
    },
    'PUT /api/customer': {
        controller: 'UserController',
        action: 'updateCustomer'
    },
    'PUT /api/customercard': {
        controller: 'UserController',
        action: 'updateCustomerCard'
    },
    'GET /api/users/:id': {
        controller: 'UserController',
        action: 'getUserById'
    },
    'PUT /api/user': {
        controller: 'UserController',
        action: 'updateUser'
    },
    'POST /api/splashpayment/txn': {
        controller: 'UserController',
        action: 'createTxn'
    },
    'POST /api/splashpayment/tokenandtxn': {
        controller: 'UserController',
        action: 'createTokenAndTxn'
    },
};

module.exports.routes = userRoutes;
