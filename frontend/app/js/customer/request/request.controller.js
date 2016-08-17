(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestController', CustomerRequestController);

    CustomerRequestController.$inject = ['$state', 'customerConstants'];

    /* @ngInject */
    function CustomerRequestController($state, customerConstants) {
        var vm = this;

        vm.tabBarData = {
            items: customerConstants.REQUEST_TABBAR_ITEMS,
            params: {
                'requestId': $state.params.requestId
            }
        };

    }
})();
