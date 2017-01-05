(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$state'];

    /* @ngInject */
    function HomeController($state) {
        var vm = this;

        activate();

        function activate() {
        }
    }
})();