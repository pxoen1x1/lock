'use strict';

let serviceRoutes = {
    'GET /api/lists/services': {
        controller: 'ServiceTypeController',
        action: 'getServiceTypes'
    }
};

module.exports.routes = serviceRoutes;