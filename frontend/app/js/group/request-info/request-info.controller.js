(function () {
    'use strict';

    angular
        .module('app.group')
        .controller('GroupRequestInfoController', GroupRequestInfoController);

    GroupRequestInfoController.$inject = ['$stateParams'];

    /* @ngInject */
    function GroupRequestInfoController($stateParams) {
        var vm = this;

        vm.currentRequestId = $stateParams.requestId;
    }
})();