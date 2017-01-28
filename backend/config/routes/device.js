'use strict';

let deviceRoutes = {
    'POST /api/devices' : {
        controller: 'DeviceController',
        action: 'saveDevice'
    }
};

module.exports.routes = deviceRoutes;