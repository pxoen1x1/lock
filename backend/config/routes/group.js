'use strict';

let groupRoutes = {
    'GET /api/group/members': {
        controller: 'GroupController',
        action: 'getGroupMembers'
    }
};

module.exports.routes = groupRoutes;