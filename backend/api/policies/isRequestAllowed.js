/* global sails, Request, Chat */

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
                if (!request || request.closed || request.executor) {

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