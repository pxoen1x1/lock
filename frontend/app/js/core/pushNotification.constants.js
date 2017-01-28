(function(){
    'use strict';

    angular
        .module('app.core')
        .constant('pushNotificationConstants', {
            ANDROID: {
                senderID: 55458036830
            },
            IOS: {
                alert: true,
                badge: true,
                sound: true
            }
        });
})();