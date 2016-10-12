/* global sails, RequestService, HelperService */
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
        let user = req.session.user.id;

        let sorting = params.order || 'updatedAt DESC';
        let pagination = {};
        pagination.limit = params.limit || sails.config.application.queryLimit;
        pagination.page = params.page || 1;

        let criteria = {
            where: {
                owner_id: user
            },
            sorting: sorting,
            skip: (pagination.page - 1) * pagination.limit,
            limit: pagination.limit
        };

        RequestService.getAll(criteria)
            .then(
                (requests) => {

                    return [RequestService.getRequestsCount({owner: user}), requests];
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
    getSpecialistRequests(req, res) {
        let params = req.allParams();
        let status = params.status;

        let user = req.session.user.id;

        let sorting = params.order || 'updatedAt DESC';
        let pagination = {};
        pagination.limit = params.limit || sails.config.application.queryLimit;
        pagination.page = params.page || 1;

        let criteria = {
            where: {
                executor_id: user
            },
            sorting: sorting,
            skip: (pagination.page - 1) * pagination.limit,
            limit: pagination.limit
        };

        if (status) {
            if (status.indexOf('!') === 0) {
                criteria.where.status = {
                    '!': status.replace('!', '')
                };
            } else {
                criteria.where.status = status;
            }
        }

        RequestService.getAll(criteria)
            .then(
                (requests) => {

                    return [RequestService.getRequestsCount({executor: user}), requests];
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
    getSpecialistNewRequests(req, res) {
        let params = req.allParams();
        let status = sails.config.requests.STATUSES.NEW;
        let sorting = params.order || 'updatedAt DESC';

        let pagination = {};
        pagination.limit = params.limit || sails.config.application.queryLimit;
        pagination.page = params.page || 1;

        let criteria = {
            where: {
                status: status,
                is_public: true
            },
            sorting: sorting,
            skip: (pagination.page - 1) * pagination.limit,
            limit: pagination.limit
        };

        RequestService.getSpecialistNewRequests(criteria)
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
        let requestId = req.params.requestId;

        if (!requestId) {

            return res.badRequest({
                message: req.__('Request is not defined.')
            });
        }

        RequestService.getRequestById({id: requestId})
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
    createRequest(req, res) {
        let newRequest = req.body.request;

        if (!newRequest) {
            return res.badRequest(
                {
                    message: req.__('Please, check data.')
                }
            );
        }

        newRequest.owner = req.session.user.id;

        RequestService.createRequest(newRequest)
            .then(
                (createdRequest) => {

                    return RequestService.getRequestById(createdRequest);
                }
            )
            .then(
                (request) => {
                    res.created(
                        {
                            request: request
                        }
                    );

                    if (!request.isPublic) {

                        return;
                    }

                    let hiddenLocation = HelperService.hideLocation(request.location);

                    request.location = hiddenLocation;

                    sails.sockets.blast(
                        'request',
                        {
                            request: request
                        },
                        req
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
    updateRequest(req, res) {
        let requestId = req.params.requestId;
        let params = req.allParams();

        let request = params.request;

        if (!requestId || !request) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        request.id = requestId;

        if (request.cost) {
            request.cost = parseFloat(request.cost).toFixed(2);
        }

        if (request.executor) {
            request.executor = request.executor.id;
        }

        delete request.isPublic;
        delete request.owner;

        RequestService.updateRequest(request)
            .then(
                (request) => {
                    res.ok({
                        request: request
                    });

                    return request;
                }
            )
            .then(
                (request) => {
                    let clientRoomName = `user_${request.owner.id}`;
                    let specialistRoomName = `user_${request.executor.id}`;

                    sails.sockets.broadcast(
                        [clientRoomName, specialistRoomName],
                        'request',
                        request,
                        req
                    );

                    return request;
                }
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    }
};

module.exports = RequestController;
