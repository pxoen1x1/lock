/*global City*/

'use strict';

let CityService = {
    getCitiesCount(searchCriteria) {
        let promise = new Promise(
            (resolve, reject) => {
                City.count(searchCriteria)
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
    }
};

module.exports = CityService;