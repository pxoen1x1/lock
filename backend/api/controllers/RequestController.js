/* global sails, RequestService */
/**
 * RequestController
 *
 * @description :: Server-side logic for managing Requests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let RequestController = {
    create(req, res) {
        let newRequest = req.body.request;

        if (!newRequest) {
            return res.badRequest(
                {
                    message: sails.__('Please, check data.')
                }
            );
        }

        newRequest.creator = req.user.id;

        RequestService.create(newRequest)
            .then(
                (createdRequest) => res.created(
                    {
                        request: createdRequest
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    res.serverError();
                }
            );
    }
};

module.exports = RequestController;
