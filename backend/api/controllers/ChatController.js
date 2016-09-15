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
        if (!req.isSocket) {

            return res.badRequest(
                {
                    message: 'This is not a socket request.'
                });
        }

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

        if (!params.request || !params.contact || !params.contact.id) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        let user = req.session.user.id;
        let contact = parseInt(params.contact.id, 10);
        let request = params.request;

        Chat.create({
            owner: user,
            contact: contact,
            request: request
        })
            .then(
                (createdChat) => {

                    return res.ok({
                        chat: createdChat
                    });
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

