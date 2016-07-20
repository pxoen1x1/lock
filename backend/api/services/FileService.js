'use strict';

let fs = require('fs');

let FileService = {
    readFile(filePath, optons) {
        let promise = new Promise((resolve, reject) => {
            fs.readFile(filePath, optons,
                (error, file) => {
                    if (error) {

                        return reject(error);
                    }

                    return resolve(file);
                });
        });

        return promise;
    }
};

module.exports = FileService;