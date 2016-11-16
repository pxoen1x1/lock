/* global sails, JwtService, SocketService */

/**
 * SocketController
 *
 * @description :: Server-side logic for managing Sockets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let SocketController = {
    subscribe(req, res) {
        let user = req.session.user;
        let roomName = `user_${user.id}`;

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
    },
    unsubscribe(req, res) {
        let user = req.session.user;

        let roomName = `user_${user.id}`;

        SocketService.unsubscribe(roomName)
            .then(
                () => res.ok(
                    {
                        message: req.__('Unsubscribed successfully.')
                    }
                )
            )
            .catch(function (err) {
                sails.log.error(err);

                res.serverError();
            });
    }
};

module.exports = SocketController;
