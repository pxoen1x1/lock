'use strict';

let bidsRoutes = {
    'POST /api/specialist/request/:request/bids': {
        controller: 'BidController',
        action: 'create'
    }
};

module.exports.routes = bidsRoutes;