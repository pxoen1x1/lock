'use strict';

let serviceTypesRoutes = {
    'GET /api/lists/service-types': {
        controller: 'ServiceTypeController',
        action: 'getServiceTypes'
    }
};

module.exports.routes = serviceTypesRoutes;