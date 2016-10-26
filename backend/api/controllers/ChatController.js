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
        let requestId = req.params.requestId;

        if (!requestId) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        ChatService.getChats({request_id: requestId})
            .then(
                (chats) => res.ok(
                    {
                        chats: chats
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    getSpecialistChats(req, res) {
        let specialist = req.session.user.id;

        Chat.findBySpecialist(specialist)
            .populateAll()
            .then(
                (chats) => res.ok(
                    {
                        chats: chats
                    }
                )
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

        let requestId = params.requestId;
        let specialist = params.specialist && params.specialist.id ? params.specialist.id : null;
        let client = req.session.user.id;

        if (!requestId || !specialist) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        let chat = {
            client: client,
            specialist: specialist,
            request: requestId
        };

        ChatService.createChat(chat)
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
                            type: 'create',
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

