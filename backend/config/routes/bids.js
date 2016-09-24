'use strict';

let bidsRoutes = {
    'GET /api/client/request/:request/bids': {
        controller: 'BidController',
        action: 'getClientBids'
    },
    'POST /api/specialist/request/:request/bids': {
        controller: 'BidController',
        action: 'create'
    }
};

module.exports.routes = bidsRoutes;