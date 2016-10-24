/* global sails, Request */

/**
 * isOfferConfirmationAllowed
 *
 * @module      :: Policy
 * @description :: Assumes that you are the owner of the Request and executor has been added to request;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    let params = req.allParams();
    let requestId = params.requestId;
    let owner = req.session.user.id;

    if (!requestId) {
        sails.log.debug(new Error('Submitted data is invalid.'));

        return res.badRequest({
            message: req.__('Submitted data is invalid.')
        });
    }

    Request.findOneById(requestId)
        .then(
            (foundRequest) => {
                if (!foundRequest) {
                    sails.log.debug(new Error('Request is not found.'));

                    return res.notFound({
                        message: req.__('Request is not found.')
                    });
                }

                if (foundRequest.owner !== owner || foundRequest.executor) {
                    sails.log.debug(new Error('You are not permitted to perform this action.'));

                    return res.forbidden(
                        {
                            message: req.__('You are not permitted to perform this action.')
                        }
                    );
                }

                next();
            }
        )
        .catch(
            (err) => {
                sails.log.error(err);

                res.serverError();
            }
        );
};