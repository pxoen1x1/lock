(function () {
    'use strict';

    angular
        .module('app.group')
        .controller('GroupRequestController', GroupRequestController);

    GroupRequestController.$inject = ['groupConstants'];

    /* @ngInject */
    function GroupRequestController(groupConstants) {
        var vm = this;

        vm.tabBarItems = groupConstants.REQUEST_TABBAR_ITEMS;
    }
})();