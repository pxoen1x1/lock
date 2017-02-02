/* global sails, Device, ChatService */

'use strict';

const appPath = sails.config.appPath;
const environment = sails.config.environment;
const SERVICES = sails.config.pushNotification.SERVICES;

let gcm = require('node-gcm');
let apn = require('apn');

let apnOptions = {
    token: {
        key: `${appPath}/config/certificates/${environment}/token.p8`,
        keyId: SERVICES.APN.TOKEN.KEY_ID,
        teamId: SERVICES.APN.TOKEN.TEAM_ID
    },
    production: environment === 'production'
};

let gcmSender = new gcm.Sender(SERVICES.GCM.API_KEY);
let apnProvider = new apn.Provider(apnOptions);

let PushNotificationService = {
    sendNotifications(notification, devices, data) {

        return devices.map(
            (device) => {

                return this.sendNotification(notification, device, data);
            }
        );
    },
    sendNotification(notification, device, additionalData) {
        let {title, message} = notification;
        let {platform, token} = device;

        platform = platform.toLowerCase();

        switch (platform) {
            case SERVICES.GCM.PLATFORM:
                let gmcNotification = new gcm.Message();

                if (additionalData) {
                    gmcNotification.addData(additionalData);
                }

                gmcNotification.addData('title', title);
                gmcNotification.addData('message', message);
                gmcNotification.addData('content-available', '1');
                gmcNotification.addData('sound', 'default');

                if (!Array.isArray(token)) {
                    token = [token];
                }

                return this._sendToGMC(gmcNotification, token);

            case SERVICES.APN.PLATFORM:
                let apnNotification = new apn.Notification();

                apnNotification.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                apnNotification.aps = {
                    alert: message,
                    badge: SERVICES.APN.BADGE,
                    sound: SERVICES.APN.SOUND,
                    'content-available': 1
                };
                apnNotification.topic = SERVICES.APN.TOPIC;

                if (additionalData) {
                    apnNotification.payload = additionalData;
                }

                return apnProvider.send(apnNotification, token);

            default:
                let error = new Error(`${platform} is not supported`);

                return Promise.reject(error);
        }
    },
    sendNewMessageNotifications(message) {
        let notification = {
            title: sails.__('You have a new message.'),
        };

        notification.message = `${message.sender.firstName} ${message.sender.lastName}: ${message.message}`;

        return ChatService.getChatMembers(message.chat)
            .then(
                (chatMembers) => {
                    if (!chatMembers || chatMembers.length === 0) {

                        return;
                    }

                    let devices = [];

                    chatMembers.forEach(
                        (chatMember) => {
                            if (chatMember.id !== message.sender.id) {
                                devices.push(chatMember.id);
                            }
                        }
                    );

                    if (message.sender.id !== message.chat.owner) {
                        devices.push(message.chat.owner);
                    }

                    return [message, Device.find({user: devices})];
                }
            )
            .spread(
                (message, chatMembersDvices) => {
                    if (!chatMembersDvices || chatMembersDvices.length === 0) {

                        return;
                    }

                    let data = {
                        state: {
                            name: 'chat',
                            request: message.chat.request,
                            chat: message.chat.id
                        }
                    };

                    return Promise.all(this.sendNotifications(notification, chatMembersDvices, data));
                }
            )
            .catch(
                (err) => {
                    let error = new Error(err);
                    sails.log.error(error);

                    return error;
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
                            let error = new Error(err);

                            return reject(error);
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