/* global sails, Request */

/**
 * isFeedbackAllowed
 *
 * @module      :: Policy
 * @description :: Assumes that request is done and you haven't added feedback for this request;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

const STATUS = sails.config.requests.STATUSES;

module.exports = function (req, res, next) {
    let params = req.allParams();
    let requestId = params.requestId;

    if (!requestId) {
        sails.log.debug(new Error('Submitted data is invalid.'));

        return res.badRequest({
            message: req.__('Submitted data is invalid.')
        });
    }

    Request.findOneById(requestId)
        .populate('feedbacks')
        .then(
            (foundRequest) => {
                if (!foundRequest) {
                    sails.log.debug(new Error('Request is not found.'));

                    return res.notFound({
                        message: req.__('Request is not found.')
                    });
                }

                if (!foundRequest.executor ||
                    (foundRequest.status !== STATUS.DONE && foundRequest.status !== STATUS.CLOSED) ||
                    foundRequest.feedbacks.length) {
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