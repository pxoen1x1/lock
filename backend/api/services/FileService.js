'use strict';

let fs = require('fs');
let mkdirp = require('mkdirp');
let bcryptjs = require('bcryptjs');
let crypto = require('crypto');

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
    uploadBase64File(base64, path) {
        let matches = base64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        let base64Data = matches[2];

        let promise = new Promise((resolve, reject) => {
            fs.writeFile(path, base64Data, 'base64',
                (err) => {
                    if (err) {

                        return reject(err);
                    }

                    path = path.replace(/^assets\//, '');
                    
                    return resolve(path);
                });
        });

        return promise;
    },
    saveAvatar(userId, image) {
        if (!image || !image.base64) {

            return;
        }

        let filename = this.generateFileName(image.base64);
        let path = this.getFilePath(userId, 'avatars', filename);

        return this.uploadBase64File(image.base64, path);
    },
    getFilePath(userId, dir, filename) {
        let path = `assets/uploads/users/${userId}/${dir}/`;
        
        path = this.prepareDirectory(path);

        return path + filename;
    },
    generateFileName(base64) {
        let buffer = crypto.randomBytes(sails.config.application.tokenLength);
        let filename = buffer.toString('hex');
        let matches = base64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        let extension = matches[1];

        return `${filename}.${extension}`;
    },
    prepareDirectory(path) {
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