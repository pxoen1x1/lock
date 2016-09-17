/* global sails */

'use strict';

let SocketService = {
    subscribe(req, roomName) {
        let promise = new Promise((resolve, reject) => {
            sails.sockets.join(req, roomName,
                (err) => {
                    if(err) {

                        return reject(err);
                    }

                    return resolve();
            });
        });

        return promise;
    },
    leaveAll(roomName) {
        let promise = new Promise((resolve, reject) => {
            sails.sockets.leaveAll(roomName,
                (err) => {
                    if(err) {

                        return reject(err);
                    }

                    return resolve();
                });
        });

        return promise;
    }
};

module.exports = SocketService;