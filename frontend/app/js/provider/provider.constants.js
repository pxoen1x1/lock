(function () {
    'use strict';

    angular
        .module('app.provider')
        .constant('serviceProviderConstants',{
            REGISTRATION_STEPS: [
                {
                    id: 1,
                    templateUrl: 'provider/registration/registration-profile.html',
                    title: 'profile'
                },
                {
                    id: 2,
                    templateUrl: 'provider/registration/registration-service-information.html',
                    title: 'service'
                },
                {
                    id: 3,
                    templateUrl: 'provider/registration/registration-work-information.html',
                    title: 'work'
                },
                {
                    id: 4,
                    templateUrl: 'provider/registration/registration-payments-information.html',
                    title: 'payments'
                }
            ],
            MENU_ITEMS: [
                'provider.dashboard.new'
            ],
            DASHBOARD_TABBAR_ITEMS: [
                'provider.dashboard.new',
                'provider.dashboard.current',
                'provider.dashboard.history'
            ]
        });
})();