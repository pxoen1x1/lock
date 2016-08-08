'use strict';

let cityRoutes = {
    'GET /api/lists/states/:stateId/cities': {
        controller: 'CityController',
        action: 'getCitiesByState'
    }
};

module.exports.routes = cityRoutes;