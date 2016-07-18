'use strict';

let CustomerProfileService = {
    create(profile) {
        let promise = new Promise(
            (resolve, reject) => {
                CustomerProfile.create(profile)
                    .exec((err, createdProfile) => {
                        if (err) {

                            return reject(err);
                        }

                        return resolve(createdProfile);
                    });
            });

        return promise;
    }
};

module.exports = CustomerProfileService;