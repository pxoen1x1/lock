(function () {
    'use strict';

    angular
        .module('app.provider')
        .constant('serviceProviderConstants',{
            MENU_ITEMS: [
                'provider.dashboard.new',
                'provider.messages'
            ],
            DASHBOARD_TABBAR_ITEMS: [
                'provider.dashboard.new',
                'provider.dashboard.current',
                'provider.dashboard.history'
            ],
            REQUEST_TABBAR_ITEMS: [
                'provider.dashboard.request.info',
                'provider.dashboard.request.map',
                'provider.dashboard.request.chat'
            ],
            ACCOUNT_STATUSES: {
                0: 'NOT_READY',
                1: 'READY_FOR_VERIFICATION',
                2: 'CHALLENGED',
                3: 'VERIFIED',
                4: 'MANUAL',
                NOT_READY: 0,
                READY_FOR_VERIFICATION: 1,
                CHALLENGED: 2,
                VERIFIED: 3,
                MANUAL: 4
            },
        });
})();