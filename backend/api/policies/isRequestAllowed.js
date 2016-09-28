/* global sails, Request, Chat */

/**
 * isRequestAllowed
 *
 * @module      :: Policy
 * @description :: Assumes that request wasn't executed or wasn't closed;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    let params = req.allParams();
    let request = params.request;
    let chat = params.chat;

    let requestPromise;

    if (!request && !chat) {

        return res.badRequest(
            {
                message: req.__('Submitted data is invalid.')
            }
        );
    }

    if (request) {
        requestPromise = getRequest(request);
    } else {
        requestPromise = Chat.findOneById(chat)
            .then(
                (chat) => getRequest(chat.request)
            );
    }

    requestPromise
        .then(
            (request) => {
                if (!request || request.isClosed || request.executor) {

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

function getRequest(requestId) {

    return Request.findOneById(requestId)
        .then(
            (request) => {

                return request;
            }
        );
}