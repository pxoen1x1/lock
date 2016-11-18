/* global sails */

'use strict';

let SocketService = {
    subscribe(socket, roomName) {
        let promise = new Promise((resolve, reject) => {
            sails.sockets.join(socket, roomName,
                (err) => {
                    if(err) {

                        return reject(err);
                    }

                    return resolve();
            });
        });

        return promise;
    },
    unsubscribe(roomName) {
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