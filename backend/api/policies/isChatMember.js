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
    let chat = req.params.chatId;
    let user = req.session.user.id;

    if (!chat) {
        sails.log.debug(new Error('Submitted data is invalid.'));


        return res.badRequest({
            message: req.__('Submitted data is invalid.')
        });
    }

    Chat.findOneById(chat)
        .then(
            (foundChat) => {
                if (!foundChat) {
                    sails.log.debug(new Error('Chat is not found.'));


                    return res.notFound(
                        {
                            message: req.__('Chat is not found.')
                        }
                    );
                }

                let isChatOwner = user === foundChat.owner;
                let isChatMembers = foundChat.members
                    .some(
                        (member) => member.id === user
                    );

                if (!isChatMembers && !isChatOwner) {
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
