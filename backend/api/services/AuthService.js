'use strict';
/**
 * Auth Service
 */

let AuthService = {
    logIn(req, user) {
        let promise = new Promise((resolve, reject) => {
            req.logIn(user,
                (err) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
        });

        return promise;
    }
};

module.exports = AuthService;