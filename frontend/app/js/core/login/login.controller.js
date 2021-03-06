(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('LoginController', LoginController);

    LoginController.$inject = [
        '$state',
        '$mdDialog',
        'toastService',
        'coreConstants',
        'coreDataservice',
        'authService',
        'currentUserService',
        'specialistGeoService',
        'mobileService'
    ];

    /* @ngInject */
    function LoginController($state, $mdDialog, toastService, coreConstants, coreDataservice, authService,
                             currentUserService, specialistGeoService, mobileService) {
        var vm = this;

        vm.user = {};

        vm.isForgotPasswordEnabled = false;

        vm.submit = submit;
        vm.cancel = cancel;

        function login(user) {

            return authService.login(user)
                .then(function (result) {

                    return result;
                });
        }

        function resetUserPassword(user) {

            return coreDataservice.resetUserPassword(user)
                .then(function (result) {

                    return result;
                });
        }

        function getCurrentUserType() {

            return currentUserService.getType()
                .then(function (currentUserType) {

                        return currentUserType;
                    }
                );
        }

        function submit(user, isFromValid, isForgotPasswordEnabled) {
            if (!isFromValid) {

                return;
            }

            if (isForgotPasswordEnabled) {

                return resetUserPassword(user)
                    .then(function () {
                        toastService.success('Please check your email');
                    });
            }

            login(user)
                .then(function () {
                    $mdDialog.hide();

                    return getCurrentUserType();
                })
                .then(function (currentUserType) {
                    var stateName = coreConstants.USER_TYPE_DEFAULT_STATE[currentUserType];

                    $state.go(stateName);

                    return currentUserType;
                })
                .then(function (currentUserType) {

                    return specialistGeoService.startGeoTracking(currentUserType);
                })
                .then(function () {

                    return mobileService.saveDeviceInfo();
                });
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
})();

