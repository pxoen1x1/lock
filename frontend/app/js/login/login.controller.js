/**
 * Created by user on 2/1/17.
 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('LoginController', LoginController);

    LoginController.$inject = [
        '$state',
        '$mdDialog',
        'coreConstants',
        'toastService',
        'coreDataservice',
        'authService',
        'currentUserService',
        'specialistGeoService',
        'mobileService'
    ];

    /* @ngInject */
    function LoginController($state, $mdDialog, coreConstants, toastService, coreDataservice, authService,
                             currentUserService, specialistGeoService, mobileService) {
        var vm = this;

        vm.user = {};

        vm.isForgotPasswordEnabled = false;

        vm.submit = submit;
        vm.cancel = cancel;

        activate();

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

                    return goToDefaultState();
                });
        }

        function goToDefaultState() {

            return getCurrentUserType()
                .then(function (userType) {
                    var stateName = coreConstants.USER_TYPE_DEFAULT_STATE[userType];

                    specialistGeoService.startGeoTracking(userType);
                    mobileService.saveDeviceInfo();

                    $state.go(stateName);
                });
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function activate() {
            if (currentUserService.isAuthenticated()) {
                goToDefaultState();
            }
        }
    }
})();
