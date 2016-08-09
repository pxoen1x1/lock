/*global UserDetail*/

'use strict';

let UserDetailService = {
    create(user, userDetails) {
        userDetails.user = user.id;

        let promise = new Promise((resolve, reject) => {
            UserDetail.create(userDetails)
                .exec(
                    (err, createdUserDetail) => {
                        if(err) {
                            return reject(err);
                        }

                        return resolve(createdUserDetail);
                    }
                );
        });

        return promise;
    }
};

module.exports = UserDetailService;