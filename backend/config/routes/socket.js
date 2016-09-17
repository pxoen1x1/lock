'use strict';

let socketRoutes= {
    'POST /socket/subscribe': {
        controller: 'SocketController',
        action: 'subscribe'
    }
};

module.exports.routes = socketRoutes;