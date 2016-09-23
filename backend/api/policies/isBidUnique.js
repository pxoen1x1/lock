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
    let request = req.params.request;
    let specialist = req.session.user.id;

    if (!request) {

        return res.badRequest(
            {
                message: req.__('Submitted data is invalid.')
            }
        );
    }

    Bid.findByRequest(request)
        .then(
            (bids) => {
                let bidExists = bids.some(
                    (bid) => {

                        return bid.specialist === specialist;
                    }
                );

                if (bidExists) {

                    return res.badRequest(
                        {
                            message: req.__('Bid has been sent already.')
                        }
                    );
                }

                return Chat.findByRequest(request);
            }
        )
        .then(
            (chats) => {
                let chatExists = chats.some(
                    (chat) => {

                        return chat.specialist === specialist;
                    }
                );

                if (chatExists) {

                    return res.badRequest(
                        {
                            message: req.__('Chat already exists.')
                        }
                    );
                }

                next();
            }
        )
        .catch(
            (err) => {
                sails.log.error(err);

                return res.serverError();
            }
        );
};
