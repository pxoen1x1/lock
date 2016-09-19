/* global sails, JwtService, Message, MessageService */
/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

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
        let params = req.allParams();

        let chat = params.chat;
        let message = params.message;
        let type = params.type || 0;
        let recipient = params.recipient && params.recipient.id ? params.recipient.id : null;
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
                    res.created(
                        {
                            message: message
                        }
                    );

                    return [JwtService.getTokenByOwner({id: recipient}), message];
                }
            )
            .spread(
                (token, message) => sails.sockets.broadcast(token, 'message',
                    {
                        message: message
                    }
                )
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
