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
                'provider.dashboard.request.view',
                'provider.dashboard.request.map',
                'provider.dashboard.request.chat'
            ]
        });
})();