'use strict';

let bidsRoutes = {
    'GET /api/client/request/:requestId/bids': {
        controller: 'BidController',
        action: 'getClientBids'
    },
    'GET /api/specialist/bids': {
        controller: 'BidController',
        action: 'getSpecialistBids'
    },
    'POST /api/specialist/request/:requestId/bids': {
        controller: 'BidController',
        action: 'createBid'
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
