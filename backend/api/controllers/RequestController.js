/* global sails, RequestService */
/**
 * RequestController
 *
 * @description :: Server-side logic for managing Requests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let RequestController = {
    getAllClientRequests(req, res) {
        let params = req.allParams();

        let searchCriteria = {
            where: {
                creator: req.user.id
            }
        };

        let sorting = params.order || 'updatedAt DESC';

        let pagination = {};
        pagination.limit = params.limit || sails.config.application.queryLimit;
        pagination.page = params.page || 1;

        RequestService.getAll(searchCriteria, sorting, pagination)
            .then(
                (foundRequests) => {

                    return RequestService.getRequestCount(searchCriteria)
                        .then(
                            (totalCount) =>
                                res.ok({
                                    items: foundRequests,
                                    currentPageNumber: pagination.page,
                                    totalCount: totalCount
                                })
                        );
                }
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    res.serverError();
                }
            );
    },
    getClientRequestById(req, res) {
        let requestId = req.params.request;

        if(!requestId){

            return res.badRequest({
                message: req.__('Request is not defined.')
            });
        }

        RequestService.getRequestById(requestId)
            .then(
                (foundRequest) => {
                    if(!foundRequest) {

                        return res.notFound({
                            message: req.__('Request is not found.')
                        });
                    }

                    return res.ok({
                        request: foundRequest
                    });
                }
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    res.serverError();
                }
            );
    },
    create(req, res) {
        let newRequest = req.body.request;

        if (!newRequest) {
            return res.badRequest(
                {
                    message: req.__('Please, check data.')
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
