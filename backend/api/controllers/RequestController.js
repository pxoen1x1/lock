/* global sails, RequestService, UserDetailService */
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

        let criteria = {
            where: {
                owner: req.session.user.id
            }
        };

        let sorting = params.order || 'updatedAt DESC';

        let pagination = {};
        pagination.limit = params.limit || sails.config.application.queryLimit;
        pagination.page = params.page || 1;

        RequestService.getAll(criteria, sorting, pagination)
            .then(
                (requests) => {

                    return [RequestService.getRequestsCount(criteria), requests];
                }
            )
            .spread(
                (totalCount, requests) => res.ok({
                    items: requests,
                    currentPageNumber: pagination.page,
                    totalCount: totalCount
                })
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    res.serverError();
                }
            );
    },
    getAllSpecialistRequests(req, res) {
        let params = req.allParams();

        let criteria = {
            where: {
                executor: req.session.user.id
            }
        };

        let sorting = params.order || 'updatedAt DESC';

        let pagination = {};
        pagination.limit = params.limit || sails.config.application.queryLimit;
        pagination.page = params.page || 1;

        RequestService.getAll(criteria, sorting, pagination)
            .then(
                (requests) => {

                    return [RequestService.getRequestsCount(criteria), requests];
                }
            )
            .spread(
                (totalCount, requests) => res.ok({
                    items: requests,
                    currentPageNumber: pagination.page,
                    totalCount: totalCount
                })
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

        if (!requestId) {

            return res.badRequest({
                message: req.__('Request is not defined.')
            });
        }

        RequestService.getRequestById(requestId)
            .then(
                (foundRequest) => {
                    if (!foundRequest) {

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

        newRequest.owner = req.session.user.id;

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
    },
    createFeedback(req, res) {
        let feedback = req.allParams();
        feedback.rating = feedback.rating ? parseInt(feedback.rating, 10) : undefined;

        if (!feedback.request || !feedback.message ||
            (typeof feedback.rating !== 'undefined' && (feedback.rating < 1 || feedback.rating > 5))) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        feedback.author = req.session.user.id;

        RequestService.createFeedback(feedback)
            .then(
                (createdFeedback) => {
                    res.created(
                        {
                            feedback: createdFeedback
                        });

                    return createdFeedback;
                }
            )
            .then(
                (feedback)=> {
                    let executor = feedback.executor;

                    return UserDetailService.updateRating({id: executor});
                }
            )
            .catch(
                (err) => {
                    if (err) {
                        sails.log.error(err);

                        return res.serverError();
                    }

                    return res.badRequest(
                        {
                            message: req.__('Request is not completed.')
                        }
                    );
                }
            );
    }
};

module.exports = RequestController;
