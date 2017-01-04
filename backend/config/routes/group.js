'use strict';

let appConfig = require('../application');

let groupRoutes = {
    'GET /api/group/members': {
        controller: 'GroupController',
        action: 'getGroupMembers'
    },
    'GET /api/group/members/search': {
        controller: 'GroupController',
        action: 'searchGroupMember'
    },
    'GET /api/group/members/:memberId': {
        controller: 'GroupController',
        action: 'getGroupMember'
    },
    [`GET ${appConfig.application.urls.groupInvitation}`]: {
        controller: 'GroupController',
        action: 'joinMember'
    },
    'POST /api/group/members/invite': {
        controller: 'GroupController',
        action: 'inviteMember'
    },
    'DELETE /api/group/members/:memberId': {
        controller: 'GroupController',
        action: 'removeMember'
    }
};

module.exports.routes = groupRoutes;