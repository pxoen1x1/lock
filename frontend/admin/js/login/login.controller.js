(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'authService', 'currentUserService'];

    /* @ngInject */
    function LoginController($state, authService, currentUserService) {
        var vm = this;

        vm.user = {};

        vm.submit = submit;

        activate();

        function login(user) {

            return authService.login(user);
        }

        function logout() {

            return authService.logout();
        }

        function isCurrentUserAdmin() {

            return currentUserService.isAdmin();
        }

        function submit(user, isFromValid) {
            if (!isFromValid) {

                return;
            }

            login(user)
                .then(isCurrentUserAdmin)
                .then(function (isAdmin) {
                    console.log(isAdmin);
                    if (!isAdmin) {

                        return logout();
                    }

                    $state.go('dashboard');
                });
        }

        function activate() {
        }
    }
})();