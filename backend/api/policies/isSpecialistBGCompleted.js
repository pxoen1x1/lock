/* global sails, UserDetail */

/**
 * isSpecialistBGCompleted
 *
 * @module      :: Policy
 * @description :: Assumes that you passed background check;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

const IS_BG_CHECK_ENABLED = sails.config.IS_BG_CHECK_ENABLED;

module.exports = function (req, res, next) {
    if (!IS_BG_CHECK_ENABLED) {

        return next();
    }

    let user = req.session.user;

    UserDetail.findOneByUser(user.id)
        .then(function (userDetail) {
            if (userDetail && !userDetail.isBGCheckCompleted) {
                sails.log.debug(new Error('You should pass background check.'));

                return res.forbidden(
                    {
                        message: req.__('You should pass background check.')
                    }
                );
            }

            next();
        });
};