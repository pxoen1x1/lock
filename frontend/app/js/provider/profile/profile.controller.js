(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderProfileController', ProviderProfileController);

    ProviderProfileController.$inject = [];

    /* @ngInject */
    function ProviderProfileController() {
        var vm = this;

        vm.dataSource = {};
    }
})();