(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestMapController', CustomerRequestMapController);

    CustomerRequestMapController.$inject = ['$state'];

    /* @ngInject */
    function CustomerRequestMapController($state) {
        var vm = this;

    }
})();