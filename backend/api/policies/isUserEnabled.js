/* global sails */

/**
 * isUserEnabled
 *
 * @module      :: Policy
 * @description :: Assumes that your user account is enabled;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    if (!req.session || !req.session.user || !req.session.user.isEnabled) {
        sails.log.debug(new Error('Please, confirm your registration.'));

        return res.json(401,
            {
                message: req.__('Please, confirm your registration.')
            }
        );
    }

    next();
};
