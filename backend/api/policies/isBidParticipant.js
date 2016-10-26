/* global sails, Bid */

/**
 * isBidParticipant
 *
 * @module      :: Policy
 * @description :: Assumes that you are a participant of a bid;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    let params = req.allParams();

    let bid = params.bid;
    let user = req.session.user.id;

    if (!bid) {
        sails.log.debug(new Error('Submitted data is invalid.'));

        return res.badRequest({
            message: req.__('Submitted data is invalid.')
        });
    }

    Bid.findOneById(bid)
        .then(
            (foundBid) => {
                if (!foundBid) {
                    sails.log.debug(new Error('Bid is not found'));

                    return res.notFound({
                        message: req.__('Bid is not found.')
                    });
                }

                let isBidParticipant = (user === foundBid.client) || (user === foundBid.specialist);

                if (!isBidParticipant) {
                    sails.log.debug(new Error('You are not permitted to perform this action.'));

                    return res.forbidden(
                        {
                            message: req.__('You are not permitted to perform this action.')
                        }
                    );
                }

                next();
            }
        )
        .catch(
            (err) => {
                sails.log.error(err);

                res.serverError();
            }
        );
};