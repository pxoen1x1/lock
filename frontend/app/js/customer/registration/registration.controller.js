(function () {
    'use strict';

    angular
        .module('app.customer')
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

            var params = {
                auth: auth,
                user: user
            };

            return authService.register(params)
                .then(function () {
                    $state.go('home');
                });
        }
    }
})();
