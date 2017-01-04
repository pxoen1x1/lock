/* global sails, MessageService */
/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

const MESSAGE_TYPE = sails.config.messages.TYPES;

let MessageController = {
    getMessages(req, res) {
        let params = req.allParams();
        let chat = req.params.chatId;

        if (!chat) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        let criteria = {
            where: {
                chat: chat
            }
        };

        let sorting = 'updatedAt DESC';

        let pagination = {};
        pagination.page = params.page || 1;
        pagination.limit = params.limit || sails.config.application.chat.messagesLimit;

        MessageService.getMessages(criteria, sorting, pagination)
            .then(
                (messages) => [MessageService.getMessagesCount(criteria), messages]
            )
            .spread(
                (totalCount, messages) => res.ok(
                    {
                        items: messages,
                        currentPageNumber: pagination.page,
                        totalCount: totalCount
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
    createMessage(req, res) {
        let params = req.allParams();

        let chat = req.params.chatId;
        let message = params.message;
        let sender = req.session.user.id;

        if (!message || !message.message || !chat) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        let newMessage = {
            message: message.message,
            type: message.type || MESSAGE_TYPE.MESSAGE,
            sender: sender,
        };

        if (message.cost) {
            newMessage.cost = message.cost;
        }

        MessageService.create({id: chat}, newMessage)
            .then(
                (message) => {
                    res.created(
                        {
                            message: message
                        }
                    );

                    return message;
                }
            )
            .then(
                (message) => {
                    let roomName = `chat_${message.chat.id}`;

                    sails.sockets.broadcast(
                        roomName,
                        'message',
                        {
                            type: 'create',
                            message: message
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
    createOffer(req, res) {
        let params = req.allParams();

        let chatId = req.params.chatId;
        let offer = params.offer;
        let sender = params.offer.executor || req.session.user;

        if (!chatId || !offer || !offer.message || !offer.cost) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        let chat = {
            id: chatId
        };

        let newMessage = {
            message: offer.message,
            cost: offer.cost,
            type: MESSAGE_TYPE.OFFER,
            sender: sender
        };

        MessageService.create(chat, newMessage)
            .then(
                (message) => {
                    res.created(
                        {
                            message: message
                        }
                    );

                    return message;
                }
            )
            .then(
                (message) => {
                    let roomName = `chat_${message.chat.id}`;

                    sails.sockets.broadcast(
                        roomName,
                        'message',
                        {
                            type: 'create',
                            message: message
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
    translateMessage(req, res) {
        let messageId = req.params.messageId;
        let params = req.allParams();
        let lang = params.lang;

        if (!messageId || !lang || !lang.id) {
            return res.badRequest({
                message: req.__('Submitted data is invalid.')
            });
        }

        let message = {
            id: messageId
        };

        MessageService.translateMessage(message, lang)
            .then(
                (translatedMessage) => res.ok({
                    message: {
                        id: translatedMessage.message,
                        message: translatedMessage.translated
                    }
                })
            );
    },
    uploadFile(req, res) {
        let chat = req.params.chatId;

        if (!chat) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        let dir = `assets/uploads/chats/${chat}/`;

        req.file('file').upload({
            dirname: require('path').resolve(sails.config.appPath, dir)
        }, function (err, uploadedFiles) {
            if (err) {
                sails.log.error(err);

                return res.serverError();
            }

            uploadedFiles = uploadedFiles.map((uploadedFile) => {

                return {
                    fd: uploadedFile.fd.replace(/.+\/assets/, ''),
                    filename: uploadedFile.filename,
                    size: uploadedFile.size,
                    type: uploadedFile.type,
                    uploadedAt: (new Date()).toISOString()
                };
            });

            res.created({
                files: uploadedFiles
            });
        });
    }
};

module.exports = MessageController;
