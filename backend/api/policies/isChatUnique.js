/* global sails, Chat */

/**
 * isChatUnique
 *
 * @module      :: Policy
 * @description :: Assumes that chat wasn't already created;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    let params = req.allParams();

    let requestId = req.params.requestId;
    let specialist = params.specialist && params.specialist.id ? params.specialist.id : null;

    if (!requestId || !specialist) {
        sails.log.debug(new Error('Submitted data is invalid.'));

        return res.badRequest(
            {
                message: req.__('Submitted data is invalid.')
            }
        );
    }

    Chat.findByRequest(requestId)
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

                        return res.badRequest(
                            {
                                message: req.__('Chat already exists.')
                            }
                        );
                    }
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
