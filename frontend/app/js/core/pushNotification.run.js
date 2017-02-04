(function () {
    'use strict';

    angular
        .module('app.core')
        .run(pushNotificationRun);

    pushNotificationRun.$inject = ['mobileService'];

    /* @ngInject */
    function pushNotificationRun(mobileService) {
        if (!mobileService.isMobileApplication()) {

            return;
        }

        mobileService.initPushNotifications();
    }
})();