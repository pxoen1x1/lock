/* global Request, Bid */
'use strict';

let BidService = {
    create(bid) {

        return Request.findOneById(bid.request)
            .then(
                (request) => {
                    bid.client = request.owner;

                    return Bid.create(bid);
                }
            );
    }
};

module.exports = BidService;