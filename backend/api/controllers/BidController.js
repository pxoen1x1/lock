/* global sails, Bid, BidService */
/**
 * BidController
 *
 * @description :: Server-side logic for managing Bids
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let BidController = {
    getClientBids(req, res) {
        let request = req.params.request;

        if (!request) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        Bid.findByRequest(request)
            .populateAll()
            .then(
                (bids) => res.ok(
                    {
                        bids: bids
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    getSpecialistBids(req, res) {
        let specialist = req.session.user.id;

        Bid.findBySpecialist(specialist)
            .populateAll()
            .then(
                (bids) => res.ok(
                    {
                        bids: bids
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
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
                (createdBid) => {
                    res.created(
                        {
                            bid: createdBid
                        }
                    );

                    return createdBid;
                }
            )
            .then(
                (bid) => {
                    let roomName = `user_${bid.client}`;

                    sails.sockets.broadcast(
                        roomName,
                        'bid',
                        {
                            bid: bid
                        },
                        req
                    );
                }
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

