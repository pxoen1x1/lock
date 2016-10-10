(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderDashboardController', ProviderDashboardController);

    ProviderDashboardController.$inject = ['serviceProviderConstants'];

    /* @ngInject */
    function ProviderDashboardController(serviceProviderConstants) {
        var vm = this;

        vm.tabBarItems = serviceProviderConstants.DASHBOARD_TABBAR_ITEMS;
    }
})();