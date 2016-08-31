(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderRequestsController', ProviderRequestsController);

    ProviderRequestsController.$inject = [];

    /* @ngInject */
    function ProviderRequestsController() {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();