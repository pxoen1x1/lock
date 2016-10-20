'use strict';

let userDetailRoutes = {
    'PUT /api/specialist/location': {
        controller: 'UserDetailsController',
        action: 'updateLocation'
    }
};

module.exports.routes = userDetailRoutes;