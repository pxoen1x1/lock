(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestRecommendedController', CustomerRequestRecommendedController);

    CustomerRequestRecommendedController.$inject = ['$state'];

    /* @ngInject */
    function CustomerRequestRecommendedController($state) {
        var vm = this;

    }
})();