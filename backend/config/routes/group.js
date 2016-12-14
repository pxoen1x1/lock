'use strict';

let groupRoutes = {
    'GET /api/group/members/:memberId': {
        controller: 'GroupController',
        action: 'getGroupMember'
    },
    'GET /api/group/members': {
        controller: 'GroupController',
        action: 'getGroupMembers'
    }
};

module.exports.routes = groupRoutes;