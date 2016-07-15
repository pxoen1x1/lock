(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerHistoryController', CustomerHistoryController);

    CustomerHistoryController.$inject = ['$state'];

    /* @ngInject */
    function CustomerHistoryController($state) {
        var vm = this;

    }
})();