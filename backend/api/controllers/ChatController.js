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
                    message: req.__('This is not a socket request.')
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
        if (!req.isSocket) {

            return res.badRequest(
                {
                    message: req.__('This is not a socket request.')
                });
        }

        let params = req.allParams();

        let request = params.request;
        let specialist = params.specialist;
        let user = req.session.user.id;

        if (!request || !specialist) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        Chat.create({
            client: user,
            specialist: specialist,
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

