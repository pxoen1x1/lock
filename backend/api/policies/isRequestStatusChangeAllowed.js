/* global sails, Request */

/**
 * isRequestStatusChangeAllowed
 *
 * @module      :: Policy
 * @description :: Assumes that you are allowed to change status;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

const STATUS = sails.config.requests.STATUSES;


module.exports = function (req, res, next) {
    let params = req.allParams();
    let requestId = params.requestId;
    let status = params.status;
    let user = req.session.user.id;

    if (!requestId || !status) {
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

                if ((foundRequest.owner !== user || foundRequest.executor !== user) ||
                    (foundRequest.executor === user && status === STATUS.NEW || status === STATUS.CLOSED) ||
                    (foundRequest.owner === user && status !== STATUS.CLOSED)) {
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