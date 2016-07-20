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

        vm.createUser = createUser;

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
