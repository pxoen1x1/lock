/* global sails, UserDetail */

/**
 * isSpecialist
 *
 * @module      :: Policy
 * @description :: Assumes that the user is a service provider;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    let userId = req.params.userId;

    if (!userId) {

        return res.badRequest({
            message: req.__('Submitted data is invalid.')
        });
    }

    UserDetail.findOneByUser(userId)
        .then(function (userDetail) {
            if (userDetail) {
                sails.log.debug(new Error('User is not a service provider.'));

                return res.forbidden(
                    {
                        message: req.__('User is not a service provider.')
                    }
                );
            }

            next();
        });
};