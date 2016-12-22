(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderViewRequestController', ProviderViewRequestController);

    ProviderViewRequestController.$inject = ['$stateParams'];

    /* @ngInject */
    function ProviderViewRequestController($stateParams) {
        var vm = this;

        vm.currentRequestId = $stateParams.requestId;
    }
})();