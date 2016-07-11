(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderRequestsController', ProviderRequestsController);

    ProviderRequestsController.$inject = ['$state'];

    /* @ngInject */
    function ProviderRequestsController($state) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();