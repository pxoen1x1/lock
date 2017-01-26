'use strict';

let pushNotification = {
    SERVICES: {
        GCM: {
            PLATFORM: 'android',
            COLLAPSE_KEY: 'demo',
            TIME_TO_LIVE: 7*24*3600,
            NUMBER_OF_RETRIES: 10,
            API_KEY: 'AIzaSyDevz7BePeADxYNQsdKWrf0o-vujLHc58s'
        },
        APN: {
            PLATFORM: 'ios',
            BADGE: 1,
            SOUND: 'default',
            FROM: 'Lockheal',
            TOPIC: 'com.lockheal'
        }
    }
};

module.exports.pushNotification = pushNotification;