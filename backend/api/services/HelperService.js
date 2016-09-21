'use strict';

let HelperService = {
    formatQueryResult(queryResult){
        queryResult = queryResult.map(
            (queryResultItem) => {
                let result = {};

                for (let key in queryResultItem) {
                    if (!queryResultItem.hasOwnProperty(key) || !queryResultItem[key]) {

                        continue;
                    }


                    this._convertKeyToObject(result, key, queryResultItem[key]);
                }

                return result;
            }
        );

        return queryResult;
    },
    _convertKeyToObject(result, keys, value) {
        let splitKeys = keys.split('.');

        result = result || {};

        splitKeys.reduce(
            (obj, key, index, splitKeys) => {
                if (!splitKeys || splitKeys.length === 0) {

                    return obj;
                }

                if (index === splitKeys.length - 1) {
                    obj[key] = value;

                    return obj[key];
                }

                obj[key] = obj[key] || {};

                return obj[key];
            }, result
        );
    }
};

module.exports = HelperService;