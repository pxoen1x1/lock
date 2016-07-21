(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$mdDialog'];

    /* @ngInject */
    function LoginController($mdDialog) {
        var vm = this;

        vm.user = {};

        vm.login = login;
        vm.cancel = cancel;

        activate();

        function login(user, isFromValid) {
            if (!isFromValid) {

                return;
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function activate() {
        }
    }
})();

