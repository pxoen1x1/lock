/* global sails, Chat, ChatService */

/**
 * ChatController
 *
 * @description :: Server-side logic for managing Chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let ChatController = {
    getClientChats(req, res) {
        let request = req.params.request;

        if (!request) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        ChatService.getChats({request: request})
            .then(
                (chats) => res.ok({
                    chats: chats
                })
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    createChat(req, res) {
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

        Chat.create({
            client: client,
            specialist: specialist,
            request: request
        })
            .then(
                (chat) => ChatService.getChat(chat.id)
            )
            .then(
                (createdChat) => {
                    res.ok({
                        chat: createdChat
                    });

                    return createdChat;
                }
            )
            .then(
                (chat) => {
                    let specialistRoom = `user_${chat.specialist.id}`;

                    sails.sockets.broadcast(
                        specialistRoom,
                        'chat',
                        {
                            chat: chat
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

module.exports = ChatController;

