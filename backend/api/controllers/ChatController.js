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
        let owner = req.session.user.id;

        if (!requestId) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        ChatService.getChats({request: requestId, owner: owner})
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
        let member = req.session.user;

        ChatService.getSpecialistChats(member)
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
        let member = req.session.user.id;

        if (!requestId) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        Chat.findOne({request: requestId, members: member})
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
        let member = params.member && params.member.id ? params.member : null;
        let owner = req.session.user.id;

        if (!requestId || !member) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        let chat = {
            owner: owner,
            members: member,
            request: requestId
        };

        ChatService.createChat(chat, member)
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
                    if (!chat.members || !chat.members.length) {

                        return;
                    }

                    let memberRooms = chat.members.map(
                        (member) => `user_${member.id}`
                    );

                    sails.sockets.broadcast(
                        memberRooms,
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

