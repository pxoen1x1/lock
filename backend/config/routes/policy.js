'use strict';

let policyRoutes = {
    'GET /api/policies': {
        controller: 'PolicyController',
        action: 'getPolicies'
    }
};

module.exports.routes = policyRoutes;