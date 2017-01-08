(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['$state'];

    /* @ngInject */
    function UsersController($state) {
        var vm = this;

        activate();

        function activate() {
        }
    }
})();