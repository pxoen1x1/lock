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

    let request = params.request;
    let specialist = params.specialist && params.specialist.id ? params.specialist.id : null;
    let client = req.session.user.id;

    if (!request || !specialist) {

        return res.badRequest(
            {
                message: req.__('Submitted data is invalid.')
            }
        );
    }


    Chat.findByRequest(request)
        .then(
            (chats) => {
                let chatExists = chats.some(
                    (chat) => {

                        return chat.client === client && chat.specialist === specialist;
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
