(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('AdminUsersController', AdminUsersController);

    AdminUsersController.$inject = ['adminConstants'];

    /* @ngInject */
    function AdminUsersController(adminConstants) {
        var vm = this;

        vm.tabBarItems = adminConstants.USERS_TABBAR_ITEMS;
    }
})();