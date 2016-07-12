(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRegistrationController', CustomerRegistrationController);

    CustomerRegistrationController.$inject = ['$state'];

    /* @ngInject */
    function CustomerRegistrationController($state) {
        var vm = this;
        vm.submit = submit;
        vm.phoneRegExp = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
        vm.showSocial = false;

        function submit() {
            alert(angular.toJson(vm.user));
        }
    }
})();
