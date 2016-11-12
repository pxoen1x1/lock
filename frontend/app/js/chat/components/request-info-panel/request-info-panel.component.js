(function () {
    'use strict';

    var requestInfoPanelConfig = {
        controller: RequestInfoPanelController,
        controllerAs: 'vm',
        templateUrl: 'chat/components/request-info-panel/request-info-panel.html',
        replace: true,
        bindings: {
            selectedRequest: '=',
            toggleSidenav: '&'
        }
    };

    angular
        .module('app.chat')
        .component('requestInfoPanel', requestInfoPanelConfig);

    RequestInfoPanelController.$inject = ['coreConstants'];

    /* @ngInject */
    function RequestInfoPanelController(coreConstants) {
        var vm = this;

        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.close = close;

        function close() {
            vm.toggleSidenav({navID: 'right-sidenav'});
        }
    }
})();

