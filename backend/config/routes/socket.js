'use strict';

let socketRoutes= {
    'POST /socket/subscribe': {
        controller: 'SocketController',
        action: 'subscribe'
    },
    'POST /socket/unsubscribe': {
        controller: 'SocketController',
        action: 'unsubscribe'
    }
};

module.exports.routes = socketRoutes;