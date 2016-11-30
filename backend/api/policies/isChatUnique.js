/* global sails, ChatService */

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
    let member = params.member && params.member.id ? params.member.id : null;

    if (!requestId || !member) {
        sails.log.debug(new Error('Submitted data is invalid.'));

        return res.badRequest(
            {
                message: req.__('Submitted data is invalid.')
            }
        );
    }

    ChatService.getChats({request: requestId})
        .then(
            (chats) => {
                if (chats && chats.length > 0) {
                    let chatExists = chats.some(
                        (chat) => chat.members.some(
                            (chatMember) => chatMember.id === member
                        )
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
