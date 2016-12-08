(function () {
    'use strict';

    angular
        .module('app.registration')
        .controller('CustomerRegistrationController', CustomerRegistrationController);

    CustomerRegistrationController.$inject = ['$state', 'authService'];

    /* @ngInject */
    function CustomerRegistrationController($state, authService) {
        var vm = this;

        vm.user = {};

        vm.showSocialButtons = false;

        vm.loginWithFacebook = loginWithFacebook;
        vm.createUser = createUser;

        function login(type) {

            return authService.login(null, type)
                .then(function (user) {

                    return user;
                });
        }

        function loginWithFacebook() {
            var loginType = 'facebook';

            login(loginType);
        }

        function createUser(auth, user, isFormValid) {
            if (!isFormValid) {

                return;
            }

            auth.user = user;

            var params = {
                auth: auth
            };

            return authService.register(params)
                .then(function () {
                    $state.go('home');
                });
        }
    }
})();
