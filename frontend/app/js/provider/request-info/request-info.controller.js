(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderInfoRequestController', ProviderInfoRequestController);

    ProviderInfoRequestController.$inject = ['$stateParams'];

    /* @ngInject */
    function ProviderInfoRequestController($stateParams) {
        var vm = this;

        vm.currentRequestId = $stateParams.requestId;
    }
})();