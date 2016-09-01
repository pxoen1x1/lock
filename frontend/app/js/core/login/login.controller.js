(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', '$mdDialog', 'toastService', 'coreDataservice', 'authService'];

    /* @ngInject */
    function LoginController($state, $mdDialog, toastService, coreDataservice, authService) {
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

                    $state.go('home');
                });
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
})();

