(function () {
    'use strict';

    angular
        .module('app.group')
        .controller('GroupDashboardController', GroupDashboardController);

    GroupDashboardController.$inject = ['groupConstants'];

    /* @ngInject */
    function GroupDashboardController(groupConstants) {
        var vm = this;

        vm.tabBarItems = groupConstants.DASHBOARD_TABBAR_ITEMS;
    }
})();