'use strict';

let bidsRoutes = {
    'GET /api/client/requests/:requestId/bids': {
        controller: 'BidController',
        action: 'getClientBids'
    },
    'GET /api/specialist/bids': {
        controller: 'BidController',
        action: 'getSpecialistBids'
    },
    'POST /api/specialist/requests/:requestId/bids': {
        controller: 'BidController',
        action: 'createBid'
    },
    'PUT /api/client/bids/:bidId/refuse': {
        controller: 'BidController',
        action: 'refuseBidByClient'
    },
    'DELETE /api/bids/:bidId': {
        controller: 'BidController',
        action: 'deleteBid'
    }
};

module.exports.routes = bidsRoutes;
