/* global Request */

'use strict';

let RequestService = {
    getAll(searchCriteria, sorting, pagination) {
        let promise = new Promise((resolve, reject) => {
            Request.find(searchCriteria)
                .sort(sorting)
                .populateAll()
                .paginate(pagination)
                .exec(
                    (err, foundRequests) => {
                        if (err) {

                            return reject(err);
                        }

                        return resolve(foundRequests);
                    }
                );
        });

        return promise;
    },
    getRequestCount(searchCriteria) {
        let promise = new Promise((resolve, reject) => {
            Request.count(searchCriteria)
                .exec(
                    (err, count) => {
                        if (err) {

                            return reject(err);
                        }

                        return resolve(count);
                    }
                );
        });

        return promise;
    },
    create(request) {
        let promise = new Promise((resolve, reject) => {
            Request.create(request)
                .exec(
                    (err, createdRequest) => {
                        if (err) {

                            return reject(err);
                        }

                        return resolve(createdRequest);
                    }
                );
        });

        return promise;
    }
};

module.exports = RequestService;
