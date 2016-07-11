(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRegistrationController', CustomerRegistrationController);

    CustomerRegistrationController.$inject = ['$scope', '$state'];

    /* @ngInject */
    function CustomerRegistrationController($scope, $state) {
        var vm = this;
        vm.submit = submit;
        $scope.phoneRegExp = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;

        function submit() {
            alert($scope.regForm.$valid);
        }
    }
})();
