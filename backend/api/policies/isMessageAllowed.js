/* global sails, Message, Chat */

/**
 * isMessageAllowed
 *
 * @module      :: Policy
 * @description :: Assumes that the message exists and you are a participant in the chat;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    let messageId = req.params.messageId;
    let user = req.session.user.id;

    if (!messageId) {
        sails.log.debug(new Error('Submitted data is invalid.'));


        return res.badRequest({
            message: req.__('Submitted data is invalid.')
        });
    }

    Message.findOneById(messageId)
        .then(
            (foundMessage) => {
                if (!foundMessage) {
                    sails.log.debug(new Error('Message is not found.'));


                    return res.notFound(
                        {
                            message: req.__('Message is not found.')
                        }
                    );
                }

                let chat = foundMessage.chat;

                return Chat.findOneById(chat)
                    .populate('members');
            }
        )
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
