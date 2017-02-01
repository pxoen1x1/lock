(function(){
    'use strict';

    angular
        .module('app.core')
        .constant('pushNotificationConstants', {
            ANDROID: {
                senderID: 805709722944
            },
            IOS: {
                alert: true,
                badge: true,
                sound: true,
                clearBadge: true
            }
        });
})();