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

        return res.badRequest(
            {
                message: req.__('This is not a socket request.')
            });
    }

    next();
};