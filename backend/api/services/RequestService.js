/* global Request, UserDetailService */

'use strict';

let RequestService = {
    getAll(searchCriteria, sorting, pagination) {

        return Request.find(searchCriteria)
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
    getRequestCount(searchCriteria) {

        return Request.count(searchCriteria)
            .then(
                (count) => count
            );
    },
    create(request) {

        return Request.create(request)
            .then(
                (createdRequest) => createdRequest
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
