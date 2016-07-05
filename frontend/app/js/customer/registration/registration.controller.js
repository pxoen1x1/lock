(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRegistrationController', CustomerRegistrationController);

    CustomerRegistrationController.$inject = ['$state'];

    /* @ngInject */
    function CustomerRegistrationController($state) {
        var vm = this;
        vm.info = {
            firstName: vm.regForm.firstName,
            lastName: vm.regForm.lastName,
            email: vm.regForm.email,
            password: vm.regForm.password
        };
        vm.submit = submit;

        activate();

        function activate() {
        }
        function submit() {
            console.log(vm.info);
        }

    }
})();