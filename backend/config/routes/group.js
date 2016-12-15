'use strict';

let groupRoutes = {
    'GET /api/group/members/:memberId': {
        controller: 'GroupController',
        action: 'getGroupMember'
    },
    'GET /api/group/members': {
        controller: 'GroupController',
        action: 'getGroupMembers'
    },
    'POST /api/group/members/invite': {
        controller: 'GroupController',
        action: 'inviteMember'
    }
};

module.exports.routes = groupRoutes;