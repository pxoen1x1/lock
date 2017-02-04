/* global sails, User, SplashPaymentService */

/**
 * isMerchantProfileCompleted
 *
 * @module      :: Policy
 * @description :: Assumes that your user is admin;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    if (!req.session || !req.session.user) {
        sails.log.debug(new Error('You are not permitted to perform this action.'));

        return res.forbidden(
            {
                message: req.__('You are not permitted to perform this action.')
            }
        );
    }

    let user = req.session.user;

    User.findOneById(user.id)
        .then(
            (user) => {
                if (!user.spMerchantId) {

                    throw new Error();
                }

                return SplashPaymentService.getMerchantAccounts(user.spMerchantId);
            }
        )
        .then(
            (merchantAccounts) => {
                if(merchantAccounts.length === 0){

                    throw new Error();
                }

                return next();
            }
        )
        .catch(
            (err) => {
                sails.log.error(err);

                return res.forbidden(
                    {
                        message: req.__('Complete your profile: fill Contact info and add Bank account.')
                    }
                );
            }
        );


};
