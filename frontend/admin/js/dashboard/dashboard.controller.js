(function () {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$state'];

    /* @ngInject */
    function DashboardController($state) {
        var vm = this;

        activate();

        function activate() {
        }
    }
})();