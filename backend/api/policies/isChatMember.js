/* global sails, Chat */

/**
 * isChatMember
 *
 * @module      :: Policy
 * @description :: Assumes that you are a participant in a chat;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    let params = req.allParams();

    let chat = params.chat;
    let user = req.session.user.id;

    if (!chat) {

        return res.badRequest({
            message: req.__('Submitted data is invalid.')
        });
    }

    Chat.findOneById(chat)
        .then(
            (foundChat) => {
                if (!foundChat) {

                    return res.notFound({
                        message: req.__('Chat is not found.')
                    });
                }

                let isChatMember = user === foundChat.client  || user === foundChat.specialist;

                if (!isChatMember) {

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