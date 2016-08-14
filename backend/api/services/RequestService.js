/* global Request */

'use strict';

let RequestService = {
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
