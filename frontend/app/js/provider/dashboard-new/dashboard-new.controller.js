(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('SpecialistNewRequestsController', SpecialistNewRequestsController);

    SpecialistNewRequestsController.$inject = ['coreDataservice'];

    /* @ngInject */
    function SpecialistNewRequestsController(coreDataservice) {
        var vm = this;

        vm.requests = [];

        activate();

        function activate() {
        }
    }
})();