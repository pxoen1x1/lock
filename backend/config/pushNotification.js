'use strict';

let pushNotification = {
    SERVICES: {
        GCM: {
            PLATFORM: 'android',
            COLLAPSE_KEY: 'demo',
            TIME_TO_LIVE: 7*24*3600,
            NUMBER_OF_RETRIES: 10,
            API_KEY: 'AIzaSyBSenBPPFD93yv4nTrErq8wxQxprhrBTp01'
        },
        APN: {
            PLATFORM: 'ios',
            BADGE: 1,
            SOUND: 'default',
            FROM: 'Lockheal',
            TOPIC: 'com.lockheal.inc',
            DEV_KEY_ID: 'W6W9NC6L9X',
            TEAM_ID: 'JKVPR444VY'
        }
    }
};

module.exports.pushNotification = pushNotification;