/* global Request, Feedback, UserDetailService */

'use strict';

let RequestService = {
    getAll(criteria, sorting, pagination) {

        return Request.find(criteria)
            .sort(sorting)
            .populateAll()
            .paginate(pagination)
            .then(
                (foundRequests) => {
                    let executorDetailsPopulatePromises = foundRequests.map(
                        (foundRequest) => {
                            if (!foundRequest || !foundRequest.executor) {

                                return Promise.resolve(foundRequest);
                            }

                            return populateByUserDetails(foundRequest);
                        }
                    );

                    return Promise.all(executorDetailsPopulatePromises);
                }
            );
    },
    getRequestById(requestId){

        return Request.findOneById(requestId)
            .populateAll()
            .then(
                (foundRequest) => {
                    if (!foundRequest || !foundRequest.executor) {

                        return foundRequest;
                    }

                    return populateByUserDetails(foundRequest);
                }
            );
    },
    getRequestsCount(criteria) {

        return Request.count(criteria)
            .then(
                (count) => count
            );
    },
    create(request) {

        return Request.create(request)
            .then(
                (createdRequest) => createdRequest
            );
    },
    createFeedback(feedback) {

        return Request.findOneById(feedback.request)
            .then(
                (request) => {
                    if (!request.executed || !request.executor) {

                        return Promise.reject();
                    }

                    feedback.executor = request.executor;

                    return Feedback.create(feedback);
                }
            )
            .then(
                (createdFeedback) => createdFeedback
            );
    }
};

module.exports = RequestService;

function populateByUserDetails(request) {
    return UserDetailService.getUserDetailByUser(request.executor)
        .then(
            (userDetails) => {
                request.executor.details = userDetails;

                return request;
            }
        );
}
