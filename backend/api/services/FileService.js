'use strict';

let fs = require('fs');

let FileService = {
    readFile(filePath, optons) {
        let promise = new Promise((resolve, reject) => {
            fs.readFile(filePath, optons,
                (err, file) => {
                    if (err) {

                        return reject(err);
                    }

                    return resolve(file);
                });
        });

        return promise;
    }
};

module.exports = FileService;