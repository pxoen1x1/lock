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
                            if (!foundRequest.executor) {

                                return Promise.resolve(foundRequest);
                            }

                            return UserDetailService.getUserDetailByUser(foundRequest.executor)
                                .then(
                                    (userDetails) => {
                                        foundRequest.executor.details = userDetails;

                                        return foundRequest;
                                    }
                                )
                                .catch(
                                    (err) => err
                                );
                        }
                    );

                    return Promise.all(executorDetailsPopulatePromises);
                }
            )
            .catch(
                (err) => err
            );
    },
    getRequestCount(searchCriteria) {

        return Request.count(searchCriteria)
            .then(
                (count) => count
            )
            .catch(
                (err) => err
            );
    },
    create(request) {

        return Request.create(request)
            .then(
                (createdRequest) => createdRequest
            )
            .catch(
                (err) => err
            );
    }
};

module.exports = RequestService;
