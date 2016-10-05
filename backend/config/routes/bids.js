'use strict';

let bidsRoutes = {
    'GET /api/client/request/:request/bids': {
        controller: 'BidController',
        action: 'getClientBids'
    },
    'GET /api/specialist/bids': {
        controller: 'BidController',
        action: 'getSpecialistBids'
    },
    'POST /api/specialist/request/:request/bids': {
        controller: 'BidController',
        action: 'create'
    },
    'PUT /api/client/bids/:bid/refuse': {
        controller: 'BidController',
        action: 'refuseBidByClient'
    },
    'DELETE /api/bids/:bid': {
        controller: 'BidController',
        action: 'deleteBid'
    }
};

module.exports.routes = bidsRoutes;
