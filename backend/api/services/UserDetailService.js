/* global UserDetail */

'use strict';

let UserDetailService = {
    getUserDetailByUser(user) {
        let promise = new Promise((resolve, reject) => {
            UserDetail.findOneByUser(user.id)
                .populateAll()
                .exec(
                    (err, foundUserDetail) => {
                        if (err) {

                            return reject(err);
                        }

                        return resolve(foundUserDetail);
                    }
                );
        });

        return promise;
    }
};

module.exports = UserDetailService;