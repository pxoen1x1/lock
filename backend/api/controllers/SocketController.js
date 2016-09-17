/* global User */

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

        User.subscribe(req, user.id);

        return res.ok(true);
    }
};

module.exports = SocketController;
