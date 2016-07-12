(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestController', CustomerRequestController);

    CustomerRequestController.$inject = ['$state'];

    /* @ngInject */
    function CustomerRequestController($state) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();