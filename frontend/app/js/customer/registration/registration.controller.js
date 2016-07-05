(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRegistrationController', CustomerRegistrationController);

    CustomerRegistrationController.$inject = ['$state'];

    /* @ngInject */
    function CustomerRegistrationController($state) {
        var vm = this;

        activate();

        function activate() {
        }
    }
})();