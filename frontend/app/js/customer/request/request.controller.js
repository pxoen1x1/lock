(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestController', CustomerRequestController);

    CustomerRequestController.$inject = ['$state', '$mdSidenav'];

    /* @ngInject */
    function CustomerRequestController($state) {
        var vm = this;
        
        activate();

        function activate() {

        }
    }
})();