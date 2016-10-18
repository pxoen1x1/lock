'use strict';

let adminRoutes = {
    'GET /api/admin/users': {
        controller: 'AdminController',
        action: 'getUsers'
    },
    'DELETE /api/admin/user/:userId': {
        controller: 'AdminController',
        action: 'deleteUser'
    }
};

module.exports.routes = adminRoutes;