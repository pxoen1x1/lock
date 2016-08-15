'use strict';

let requestRoutes = {
    'POST /api/user/request': {
        controller: 'RequestController',
        action: 'create'
    }
};

module.exports.routes = requestRoutes;