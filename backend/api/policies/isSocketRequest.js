/* global sails */

/**
 * isSocketRequest
 *
 * @module      :: Policy
 * @description :: Assumes that this request (req) originated from a Socket.io connection;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    if (!req.isSocket) {
        sails.log.debug(new Error('This is not a socket request.'));

        return res.badRequest(
            {
                message: req.__('This is not a socket request.')
            });
    }

    next();
};