(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestViewController', CustomerRequestViewController);

    CustomerRequestViewController.$inject = ['$state'];

    /* @ngInject */
    function CustomerRequestViewController($state) {
        var vm = this;

    }
})();