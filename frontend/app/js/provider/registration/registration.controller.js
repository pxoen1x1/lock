(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderRegistrationController', ProviderRegistrationController);

    ProviderRegistrationController.$inject = ['$scope', '$state'];

    /* @ngInject */
    function ProviderRegistrationController($scope, $state) {
        var vm = this;
        vm.submit = submit;
        $scope.phoneRegExp = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;

        function submit() {
            alert($scope.regForm.$valid);
        }
    }
})();
