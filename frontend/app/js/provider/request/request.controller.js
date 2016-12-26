(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderRequestController', ProviderRequestController);

    ProviderRequestController.$inject = ['serviceProviderConstants'];

    /* @ngInject */
    function ProviderRequestController(serviceProviderConstants) {
        var vm = this;

        vm.tabBarItems = serviceProviderConstants.REQUEST_TABBAR_ITEMS;
    }
})();
