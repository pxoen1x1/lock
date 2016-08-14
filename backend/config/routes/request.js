'use strict';

let requestRoutes = {
    'POST /api/request': {
        controller: 'RequestController',
        action: 'create'
    }
};

module.exports.routes = requestRoutes;