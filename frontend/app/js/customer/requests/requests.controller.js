(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestsController', CustomerRequestsController);

    CustomerRequestsController.$inject = ['$state'];

    /* @ngInject */
    function CustomerRequestsController($state) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();