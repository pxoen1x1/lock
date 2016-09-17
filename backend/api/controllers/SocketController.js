/* global sails, User */

/**
 * SocketController
 *
 * @description :: Server-side logic for managing Sockets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let SocketController = {
    subscribe(req, res) {
        if (!req.isSocket) {

            return res.badRequest(
                {
                    message: req.__('This is not a socket request.')
                });
        }

        try {
            let user = req.session.user;

            User.subscribe(req, user.id);

            return res.ok();
        }
        catch (err) {
            sails.log.error(err);

            return res.serverError();
        }
    },
    unsubscribe(req, res) {
        if (!req.isSocket) {

            return res.badRequest(
                {
                    message: req.__('This is not a socket request.')
                });
        }

        try {
            let user = req.session.user;

            User.unsubscribe(req, user.id);

            return res.ok();
        }
        catch (err) {
            sails.log.error(err);

            return res.serverError();
        }
    }
};

module.exports = SocketController;
