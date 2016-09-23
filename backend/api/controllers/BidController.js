/* global sails, BidService */
/**
 * BidController
 *
 * @description :: Server-side logic for managing Bids
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let BidController = {
    create(req, res) {
        let bid = req.allParams();
        let specialist = req.session.user.id;

        if (!bid.request) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        bid.specialist = specialist;

        BidService.create(bid)
            .then(
                (createdBid) => res.created(
                    {
                        bid: createdBid
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    }
};

module.exports = BidController;

