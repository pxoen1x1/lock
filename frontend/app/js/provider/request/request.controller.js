(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderRequestController', ProviderRequestController);

    ProviderRequestController.$inject = ['$state', 'serviceProviderConstants'];

    /* @ngInject */
    function ProviderRequestController($state, serviceProviderConstants) {
        var vm = this;

        vm.tabBarItems = serviceProviderConstants.REQUEST_TABBAR_ITEMS;
    }
})();
