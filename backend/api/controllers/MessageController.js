/* global sails, Message */
/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let MessageController = {
    create(req, res) {
        let params = req.allParams();

        let chat = params.chat;
        let message = params.message;
        let recipient = params.recipient;
        let owner = req.session.user.id;

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
            recipient: recipient,
            owner: owner
        })
            .then(
                (createdMessage) => Message.findOneById(createdMessage.id).populateAll()
            )
            .then(
                (message) => res.created(
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
