/* global sails, User, Message, MessageService */
/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let MessageController = {
    getMessages(req, res) {
        if (!req.isSocket) {

            return res.badRequest(
                {
                    message: req.__('This is not a socket request.')
                });
        }

        let params = req.allParams();
        let chat = params.chat;

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
        pagination.limit = params.limit || sails.config.application.chatMessagesLimit;

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
    create(req, res) {
        if (!req.isSocket) {

            return res.badRequest(
                {
                    message: req.__('This is not a socket request.')
                });
        }

        let params = req.allParams();

        let chat = params.chat;
        let message = params.message;
        let type = params.type || 0;
        let recipient = params.recipient;
        let sender = req.session.user.id;

        if (!message || !chat || !recipient) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        Message.create({
            chat: chat,
            message: message,
            type: type,
            recipient: recipient,
            sender: sender
        })
            .then(
                (createdMessage) => Message.findOneById(createdMessage.id).populateAll()
            )
            .then(
                (message) => {
                    User.message(recipient,
                        {
                            type: 'message',
                            message: message
                        });

                    res.created(
                        {
                            message: message
                        }
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

module.exports = MessageController;
