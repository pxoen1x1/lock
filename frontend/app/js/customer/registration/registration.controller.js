(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRegistrationController', CustomerRegistrationController);

    CustomerRegistrationController.$inject = ['$state'];

    /* @ngInject */
    function CustomerRegistrationController($state) {
        var vm = this;

        vm.phoneRegExp = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
        vm.showSocialButtons = false;

        vm.createUser = createUser;

        function createUser(user) {

        }
    }
})();
