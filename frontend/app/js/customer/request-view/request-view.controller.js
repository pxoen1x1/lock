(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerViewRequestController', CustomerViewRequestController);

    CustomerViewRequestController.$inject = ['$state'];

    /* @ngInject */
    function CustomerViewRequestController($state) {
        var vm = this;

    }
})();