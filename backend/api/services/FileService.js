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
    },
    savePhoto(image, path, filename) {
        
        let promise = new Promise((resolve, reject) => {
            fs.writeFile(path+filename, image, 'base64',
                (err) => {
                    if (err) {

                        return reject(err);
                    }
                    
                    return resolve(filename);
                });
        });

        return promise;
    }
};

module.exports = FileService;