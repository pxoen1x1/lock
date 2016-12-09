'use strict';

let groupRoutes = {
    'GET /api/group/requests':{
        controller: 'RequestController',
        action: 'getGroupRequests'
    }
};

module.exports.routes = groupRoutes;