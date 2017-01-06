(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'authService', 'toastService'];

    /* @ngInject */
    function LoginController($state, authService, toastService) {
        var vm = this;

        vm.user = {};

        vm.submit = submit;

        activate();

        function login(user) {

            return authService.login(user);
        }


        function submit(user, isFromValid) {
            if (!isFromValid) {

                return;
            }

            login(user)
                .then(function () {
                    $state.go('dashboard');
                })
                .catch(function (error) {
                    if (error.isShown) {
                        toastService.error(error.message);
                    }
                });
        }

        function activate() {
        }
    }
})();