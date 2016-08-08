'use strict';

let serviceRoutes = {
    'GET /api/lists/services': {
        controller: 'ServiceController',
        action: 'getServices'
    }
};

module.exports.routes = serviceRoutes;