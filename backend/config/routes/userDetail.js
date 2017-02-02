'use strict';

let userDetailRoutes = {
    'PUT /api/specialist/location': {
        controller: 'UserDetailsController',
        action: 'updateLocation'
    },
    'PUT /api/specialist/:userId/background-check/completed': {
        controller: 'UserDetailsController',
        action: 'setBackgroundCheckCompleted'
    }
};

module.exports.routes = userDetailRoutes;