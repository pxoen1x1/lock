(function () {
    'use strict';

    angular
        .module('app.provider')
        .constant('serviceProviderConstants',{
            REGISTRATION_STEPS: [
                {
                    id: 1,
                    templateUrl: 'provider/registration/registration-agreement.html',
                    title: 'agreement'
                },
                {
                    id: 2,
                    templateUrl: 'provider/registration/registration-profile.html',
                    title: 'profile'
                },
                {
                    id: 3,
                    templateUrl: 'provider/registration/registration-service-information.html',
                    title: 'service'
                },
                {
                    id: 4,
                    templateUrl: 'provider/registration/registration-work-information.html',
                    title: 'work'
                },
                {
                    id: 5,
                    templateUrl: 'provider/registration/registration-payments-information.html',
                    title: 'payments'
                }
            ],
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