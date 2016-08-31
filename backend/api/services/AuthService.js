/* global waterlock */
/**
 * Auth Service
 */

'use strict';

let AuthService = {
    findAuth(criteria) {
        let promise = new Promise((resolve, reject)=> {
            waterlock.engine.findAuth(criteria,
                (err, user) => {
                    if (err) {

                        return reject(err);
                    }

                    return resolve(user);
                });
        });

        return promise;
    },
    findOrCreateAuth(criteria, attributes) {
        let promise = new Promise((resolve, reject) => {
            waterlock.engine.findOrCreateAuth(criteria, attributes,
                (err, user)=> {
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