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
    create(req, res) {
        let params = req.allParams();

        let chat = req.params.chat;
        let message = params.message;
        let sender = req.session.user.id;

        if ((!message || !message.message || !chat) || (message.type === MESSAGE_TYPE.OFFER && !message.cost)) {

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

        message.sender = sender;

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
                    let roomName = `user_${message.recipient.id}`;

                    sails.sockets.broadcast(
                        roomName,
                        'message',
                        {
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
    }
};

module.exports = MessageController;
