/* global sails, Chat, ChatService, SocketService */

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
        let client = req.session.user.id;

        if (!requestId) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        ChatService.getChats({request_id: requestId, client_id: client})
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
    getSpecialistChatByRequest(req, res) {
        let requestId = req.params.requestId;
        let specialist = req.session.user.id;

        if (!requestId) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        Chat.findOne({request: requestId, specialist: specialist})
            .populateAll()
            .then(
                (chat) => res.ok(
                    {
                        chat: chat
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
            specialists: specialist,
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
                    if (!chat.specialists || !chat.specialists.length) {

                        return;
                    }

                    let specialistRooms = chat.specialists.map(
                        (member) => `user_${member.id}`
                    );

                    sails.sockets.broadcast(
                        specialistRooms,
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
    },
    subscribeToChat(req, res) {
        let chat = req.params.chatId;

        if (!chat) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        let roomName = `chat_${chat}`;

        SocketService.subscribe(req.socket, roomName)
            .then(
                () => res.ok(
                    {
                        message: req.__('Subscribed successfully.')
                    }
                )
            )
            .catch(function (err) {
                sails.log.error(err);

                res.serverError();
            });
    }
};

module.exports = ChatController;

