/* global sails */

'use strict';

const appPath = sails.config.appPath;
const environment = sails.config.environment;
const SERVICES = sails.config.pushNotification.SERVICES;

let gcm = require('node-gcm');
let apn = require('apn');

let apnOptions = {
    production: environment === 'production',
    cert: `${appPath}/config/certificates/${environment}/cert.pem`,
    key: `${appPath}/config/certificates/${environment}/key.pem`,
};

let gcmSender = new gcm.Sender(SERVICES.GCM.API_KEY);
let apnProvider = new apn.Provider(apnOptions);

let PushNotificationService = {
    sendNotifications(notification, devices) {

        return devices.map(
            (device) => {

                return this.sendNotification(notification, device);
            }
        );
    },
    sendNotification(notification, device) {
        let {title, message} = notification;
        let {platform, token} = device;

        platform = platform.toLowerCase();

        switch (platform) {
            case SERVICES.GCM.PLATFORM:
                let gmcNotification = new gcm.Message(
                    {
                        collapseKey: SERVICES.GCM.COLLAPSE_KEY,
                        timeToLive: SERVICES.GCM.TIME_TO_LIVE,
                        notofication: {
                            title: title,
                            body: message
                        }
                    }
                );

                return this._sendToGMC(gmcNotification, token);

            case SERVICES.APN.PLATFORM:
                let apnNotification = new apn.Notification();

                apnNotification.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                apnNotification.badge = SERVICES.APN.BADGE;
                apnNotification.sound = SERVICES.APN.SOUND;
                apnNotification.alert = message;
                apnNotification.topic = SERVICES.APN.TOPIC;

                return apnProvider.send(notification, token);

            default:
                let error = new Error(`${platform} is not supported`);

                Promise.reject(error);
        }
    },
    sendNewMessageNotifications(message) {
        let notification = {
            title: sails.__('You have a new message.'),
            message: message.message
        };


        return ChatService.getChatMembers(message.chat)
            .then(
                (chatMembers) => {
                    if (!chatMembers || chatMembers.length === 0) {

                        return Promise.reject();
                    }

                    chatMembers = chatMembers.map(
                        (chatMember) => {
                            if (chatMember.id !== message.sender.id) {

                                return chatMember.id;
                            }
                        }
                    );

                    if (message.sender.id !== message.chat.owner) {
                        chatMembers.push(message.sender.id);
                    }

                    return Device.find({user: chatMembers});
                }
            )
            .then(
                (chatMembersDvices) => {
                    if (!chatMembersDvices || chatMembersDvices.length === 0) {

                        return Promise.reject();
                    }

                    return Promise.all(this.sendNotifications(notification, chatMembersDvices));
                }
            );
    },
    _sendToGMC(notification, tokens) {
        let promise = new Promise(
            (resolve, reject) => {
                gcmSender.send(
                    notification,
                    {
                        registrationTokens: tokens
                    },
                    SERVICES.GCM.NUMBER_OF_RETRIES,
                    (err, result) => {
                        if (err) {

                            return reject(err);
                        }

                        resolve(result);
                    }
                );
            }
        );

        return promise;
    }
};

module.exports = PushNotificationService;