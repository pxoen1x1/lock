/* global sails, Request */

/**
 * isUpdateRequestAllowed
 *
 * @module      :: Policy
 * @description :: Assumes that request wasn't executed or wasn't closed;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

const STATUS = sails.config.requests.STATUSES;

module.exports = function (req, res, next) {
    let params = req.allParams();
    let requestId = params.requestId;
    let updatedRequest = params.request;
    let user = req.session.user.id;


    if (!requestId) {

        return res.badRequest(
            {
                message: req.__('Submitted data is invalid.')
            }
        );
    }

    Request.findOneById(requestId)
        .then(
            (request) => {
                if (!request) {

                    return res.notFound(
                        {
                            message: req.__('Request is not found.')
                        }
                    );
                }

                let isRequestOwner = user !== request.owner;
                let isRequestMember = isRequestOwner || user !== request.executor;

                if (request.status === STATUS.CLOSED || !isRequestMember ||
                    (request.status === STATUS.NEW && !isRequestOwner)) {

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

                return res.serverError();
            }
        );
};