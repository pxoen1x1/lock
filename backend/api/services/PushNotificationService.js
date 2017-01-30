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
    sendPushNotification(notification, device) {
        let {title, message} = notification;
        let {platform, tokens} = device;

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

                return this._sendToGMC(gmcNotification, tokens);

            case SERVICES.APN.PLATFORM:
                let apnNotification = new apn.Notification();

                apnNotification.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                apnNotification.badge = SERVICES.APN.BADGE;
                apnNotification.sound = SERVICES.APN.SOUND;
                apnNotification.alert = message;
                apnNotification.topic = SERVICES.APN.TOPIC;

                return apnProvider.send(notification, tokens);

            default:
                let error = new Error(`${platform} is not supported`);

                Promise.reject(error);
        }
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