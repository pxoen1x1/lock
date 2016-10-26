/* global sails, Bid, Chat */

/**
 * isBidUnique
 *
 * @module      :: Policy
 * @description :: Assumes that bid or chat weren't already created;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    let requestId = req.params.requestId;
    let specialist = req.session.user.id;

    if (!requestId) {
        sails.log.debug(new Error('Submitted data is invalid.'));

        return res.badRequest(
            {
                message: req.__('Submitted data is invalid.')
            }
        );
    }

    Bid.findByRequest(requestId)
        .then(
            (bids) => {
                if (bids && bids.length > 0) {
                    let bidExists = bids.some(
                        (bid) => {

                            return bid.specialist === specialist;
                        }
                    );

                    if (bidExists) {
                        sails.log.debug(new Error('Bid has been sent already.'));

                        res.badRequest(
                            {
                                message: req.__('Bid has been sent already.')
                            }
                        );

                        return Promise.reject();
                    }
                }

                return Chat.findByRequest(requestId);
            }
        )
        .then(
            (chats) => {
                if (chats && chats.length > 0) {
                    let chatExists = chats.some(
                        (chat) => {

                            return chat.specialist === specialist;
                        }
                    );

                    if (chatExists) {
                        sails.log.debug(new Error('Chat already exists.'));

                        res.badRequest(
                            {
                                message: req.__('Chat already exists.')
                            }
                        );

                        return Promise.reject();
                    }
                }

                next();
            }
        )
        .catch(
            (err) => {
                if (err) {
                    sails.log.error(err);

                    return res.serverError();
                }
            }
        );
};
