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
        if (!req.isSocket) {

            return res.badRequest(
                {
                    message: req.__('This is not a socket request.')
                });
        }

        let user = req.session.user;

        JwtService.getTokenByOwner(user)
            .then(
                (token) => SocketService.subscribe(req, token)
            )
            .then(
                ()=> res.ok(
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
        if (!req.isSocket) {

            return res.badRequest(
                {
                    message: req.__('This is not a socket request.')
                });
        }

        let user = req.session.user;

        JwtService.getTokenByOwner(user)
            .then(
                (token) => SocketService.unsubscribe(req, token)
            )
            .then(
                ()=> res.ok(
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
