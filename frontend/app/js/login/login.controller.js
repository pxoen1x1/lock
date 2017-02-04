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
        'toastService',
        'coreDataservice',
        'authService',
        'currentUserService',
        'specialistGeoService',
        'coreConstants'
    ];

    /* @ngInject */
    function LoginController($state, $mdDialog, toastService, coreDataservice, authService,
                                   currentUserService, specialistGeoService, coreConstants) {
        var vm = this;

        vm.user = {};

        vm.isForgotPasswordEnabled = false;

        vm.submit = submit;
        vm.cancel = cancel;

        activate();

        function activate() {
            if (currentUserService.isAuthenticated()) {
                goToDefaultState();
            }
        }

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

                    goToDefaultState();
                })
        }

        function goToDefaultState() {
            var userType = getCurrentUserType();

            var stateName = coreConstants.USER_TYPE_DEFAULT_STATE[userType];

            specialistGeoService.startGeoTracking(userType);

            $state.go(stateName);
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
})();
