'use strict';

let UserService = {
    create(user) {
        let promise = new Promise((resolve, reject) => {
            User.create(user)
                .exec((err, createdUser) => {
                    if (err) {

                        return reject(err);
                    }

                    return resolve(createdUser);
                });
        });

        return promise;
    }
};

module.exports = UserService;