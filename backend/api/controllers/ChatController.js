/**
 * ChatController
 *
 * @description :: Server-side logic for managing Chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let ChatController = {
    _config: {
        actions: true,
        rest: true
    },

    getChats(req, res) {
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

        Chat.find({
            owner: req.session.user.id,
            request: request
        })
            .populateAll()
            .then(
                (chats) => {
                    Chat.watch(req.socket);

                    res.ok(
                        {
                            chats: chats
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
    },
    create(req, res) {
        let request = req.params.request;

        if (!request) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        res.ok({message: 'socket'});
    }
};

module.exports = ChatController;

