'use strict';

let stateRoutes = {
    'GET /api/lists/states': {
        controller: 'StateController',
        action: 'getStates'
    }
};

module.exports.routes = stateRoutes;