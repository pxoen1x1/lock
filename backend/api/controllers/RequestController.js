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
        let params = req.allParams();
        let newRequest = params.request;

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
