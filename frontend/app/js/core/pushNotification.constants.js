(function () {
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
            },
            STATES: {
                CHAT: {
                    'client': 'customer.requests.request.chat',
                    'specialist': 'provider.dashboard.request.chat',
                    'groupAdmin': 'group.dashboard.request.chat'
                },
                REQUEST: {
                    'client': 'customer.requests.request.map',
                    'specialist': 'provider.dashboard.request.info',
                    'groupAdmin': 'group.dashboard.request.info'
                }
            }
        });
})();