'use strict';

let HelperService = {
    formatObject(objects){
        objects = objects.map(
            (object) => {
                let result = {};

                for (let key in object) {
                    if (!object.hasOwnProperty(key) || !object[key]) {

                        continue;
                    }


                    this.convertKeyToObject(result, key, object[key]);
                }

                return result;
            }
        );

        return objects;
    },
    convertKeyToObject(result, keys, value) {
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