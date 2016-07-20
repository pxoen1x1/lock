(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRegistrationController', CustomerRegistrationController);

    CustomerRegistrationController.$inject = ['$state', 'customerDataservice'];

    /* @ngInject */
    function CustomerRegistrationController($state, customerDataservice) {
        var vm = this;

        vm.customer = {};
        vm.phoneRegExp = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
        vm.showSocialButtons = false;

        vm.createCustomer = createCustomer;

        function createCustomer(customer, isFormValid) {
            if (!isFormValid) {

                return;
            }

            return customerDataservice.createCustomer(customer)
                .then(function () {
                    $state.go('home');
                });
        }
    }
})();
