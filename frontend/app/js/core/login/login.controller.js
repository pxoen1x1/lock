(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', '$mdDialog', 'coreDataservice'];

    /* @ngInject */
    function LoginController($state, $mdDialog, coreDataservice) {
        var vm = this;

        vm.user = {};

        vm.isForgotPasswordEnabled = false;

        vm.submit = submit;
        vm.cancel = cancel;

        function loginUser(user) {

            return coreDataservice.loginUser(user)
                .then(function (result) {

                    return result;
                });
        }

        function submit(user, isFromValid, isForgotPasswordEnabled) {
            if (!isFromValid) {

                return;
            }

            if (isForgotPasswordEnabled) {

                return;
            }

            loginUser(user)
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

