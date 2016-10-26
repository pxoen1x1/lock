(function () {
    'use strict';

    var requestInfoConfig = {
        controller: RequestInfoController,
        controllerAs: 'vm',
        templateUrl: 'chat/components/request-info/request-info.html',
        replace: true,
        bindings: {
            selectedRequest: '=',
            toggleSidenav: '&'
        }
    };

    angular
        .module('app.chat')
        .component('requestInfo', requestInfoConfig);

    RequestInfoController.$inject = ['coreConstants'];

    /* @ngInject */
    function RequestInfoController(coreConstants) {
        var vm = this;

        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.close = close;

        function close() {
            vm.toggleSidenav({navID: 'right-sidenav'});
        }
    }
})();

