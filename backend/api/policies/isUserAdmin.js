/* global sails */

/**
 * isUserAdmin
 *
 * @module      :: Policy
 * @description :: Assumes that your user is admin;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    if (!req.session || !req.session.user || !req.session.user.isAdmin) {
        sails.log.debug(new Error('You are not permitted to perform this action.'));

        return res.forbidden(
            {
                message: req.__('You are not permitted to perform this action.')
            }
        );
    }

    next();
};
