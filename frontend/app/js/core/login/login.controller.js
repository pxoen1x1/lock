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

        vm.login = login;
        vm.cancel = cancel;

        activate();

        function loginUser(user) {

            return coreDataservice.loginUser(user)
                .then(function (result) {

                    return result;
                });
        }

        function login(user, isFromValid) {
            if (!isFromValid) {

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

        function activate() {
        }
    }
})();

