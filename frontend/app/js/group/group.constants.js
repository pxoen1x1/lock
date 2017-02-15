(function () {
    'use strict';

    angular
        .module('app.group')
        .constant('groupConstants', {
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
                'group.dashboard.new',
                'group.members',
                'group.messages',
                'group.profile'
            ],
            DASHBOARD_TABBAR_ITEMS: [
                'group.dashboard.new',
                'group.dashboard.current',
                'group.dashboard.history'
            ],
            REQUEST_TABBAR_ITEMS: [
                'group.dashboard.request.info',
                'group.dashboard.request.map',
                'group.dashboard.request.chat'
            ]
        });
})();