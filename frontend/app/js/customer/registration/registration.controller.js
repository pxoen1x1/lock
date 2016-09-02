(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRegistrationController', CustomerRegistrationController);

    CustomerRegistrationController.$inject = ['$state', 'coreDataservice'];

    /* @ngInject */
    function CustomerRegistrationController($state, coreDataservice) {
        var vm = this;

        vm.user = {};

        vm.showSocialButtons = false;

        vm.loginWithFacebook = loginWithFacebook;
        vm.createUser = createUser;

        function login(type) {

            return coreDataservice.login(null, type)
                .then(function (user) {

                    return user;
                });
        }

        function loginWithFacebook() {
            var loginType = 'facebook';

            login(loginType);
        }

        function createUser(user, isFormValid) {
            if (!isFormValid) {

                return;
            }

            return coreDataservice.createUser(user)
                .then(function () {
                    $state.go('home');
                });
        }
    }
})();
