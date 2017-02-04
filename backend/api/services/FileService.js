/* global sails, HelperService */

'use strict';

let fs = require('fs');
let mkdirp = require('mkdirp');

let FileService = {

    readFile(path, encoding) {
        let promise = new Promise(
            (resolve, reject) => {
                fs.readFile(path, encoding,
                    (err, data) => {
                        if (err) {
                            let error = new Error();
                            error.message = `File doesn't exist.`;

                            return reject(error);
                        }

                        return resolve(JSON.parse(data));
                    });
            }
        );

        return promise;
    },

    saveImage(userId, image, dir) {
        if (!image || !image.base64 || !dir) {

            return Promise.resolve();
        }

        let filename = this._generateFileName(image.base64);
        let path = this._getFilePath(userId, dir, filename);

        return this._uploadBase64File(image.base64, path);
    },
    _uploadBase64File(base64, path) {
        let matches = base64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        let base64Data = matches[2];

        let promise = new Promise((resolve, reject) => {
            fs.writeFile(path, base64Data, 'base64',
                (err) => {
                    if (err) {

                        return reject(err);
                    }

                    path = path.replace(/^assets/, '');

                    return resolve(path);
                });
        });

        return promise;
    },
    _getFilePath(userId, dir, filename) {
        let path = `assets/uploads/users/${userId}/${dir}/`;

        path = this._prepareDirectory(path);

        return path + filename;
    },
    _generateFileName(base64) {
        let filename = HelperService.generateToken();
        let matches = base64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        let extension = matches[1];

        return `${filename}.${extension}`;
    },
    _prepareDirectory(path) {
        try {
            mkdirp.sync(path, 0o755);
        } catch (err) {
            sails.log.error(err);

            return false;
        }

        return path;
    }
};

module.exports = FileService;