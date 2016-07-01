(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('RequestsController', RequestsController);

    RequestsController.$inject = ['$state'];

    /* @ngInject */
    function RequestsController($state) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();