(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestController', CustomerRequestController);

    CustomerRequestController.$inject = ['$state', 'customerConstants'];

    /* @ngInject */
    function CustomerRequestController($state, customerConstants) {
        var vm = this;

        vm.tabBarItems = customerConstants.REQUEST_TABBAR_ITEMS;
    }
})();
