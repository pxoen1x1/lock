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
        let requestId = req.params.requestId;

        if (!requestId) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        BidService.getClientBids({request: requestId})
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
    createBid(req, res) {
        let requestId = req.params.requestId;

        let params = req.allParams();
        let bid = params.bid || {};

        let specialist = req.session.user.id;

        if (!requestId) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        let newBid = {
            request: {
                id: requestId
            },
            message: bid.message,
            cost: bid.cost,
            specialist: specialist
        };

        BidService.create(newBid)
            .then(
                (createdBid) => {

                    return BidService.getBid(createdBid);
                }
            )
            .then(
                (bid) => {
                    let roomName = `user_${bid.client.id}`;

                    sails.sockets.broadcast(
                        roomName,
                        'bid',
                        {
                            type: 'create',
                            bid: bid
                        },
                        req
                    );

                    return bid;
                }
            )
            .then(
                (bid) => res.created(
                    {
                        bid: bid
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
    refuseBidByClient(req, res) {
        let bid = req.params.bid;

        if (!bid) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        let updatedBid = {
            isRefused: true
        };

        Bid.update({id: bid}, updatedBid)
            .then(
                (updatedBids) => {
                    let updatedBid = updatedBids[0];

                    res.ok(
                        {
                            bid: updatedBid
                        }
                    );

                    return updatedBid;
                }
            )
            .then(
                (bid) => {
                    let specialistRoomName = `user_${bid.specialist}`;

                    sails.sockets.broadcast(
                        specialistRoomName,
                        'bid',
                        {
                            type: 'update',
                            bid: bid
                        },
                        req
                    );

                    return bid;
                }
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    deleteBid(req, res) {
        let bid = req.params.bid;

        Bid.destroy({id: bid})
            .then(
                (bids) => {
                    let bid = bids[0];
                    let specialistRoomName = `user_${bid.specialist_id}`;

                    res.ok(
                        {
                            bid: bid
                        }
                    );

                    sails.sockets.broadcast(
                        specialistRoomName,
                        'bid',
                        {
                            type: 'delete',
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

