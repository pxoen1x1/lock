(function () {
    'use strict';

    var requestActionButtonsConfig = {
        controller: RequestActionButtonsController,
        controllerAs: 'vm',
        templateUrl: 'provider/components/request-action-buttons/request-action-buttons.html',
        replace: true,
        bindings: {
            positionMode: '@',
            currentRequest: '='
        }
    };

    angular
        .module('app.provider')
        .component('requestActionButtons', requestActionButtonsConfig);

    RequestActionButtonsController.$inject = [
        'coreConstants',
        'coreDataservice',
        'geocoderService',
        'currentRequestService'
    ];

    /* @ngInject */
    function RequestActionButtonsController(coreConstants, coreDataservice, geocoderService, currentRequestService) {
        var vm = this;

        vm.requestStatus = coreConstants.REQUEST_STATUSES;

        vm.changeRequestStatus = changeRequestStatus;

        function updateRequestStatus(request, status) {

            return coreDataservice.updateRequestStatus(request, status)
                .then(function (updatedRequest) {

                    return updatedRequest;
                });
        }

        function changeRequestStatus(request, status) {
            if (!request || !status) {

                return;
            }

            status = {
                status: status
            };

            return updateRequestStatus(request, status)
                .then(function (updatedRequest) {
                    if (updatedRequest.status === vm.requestStatus.IN_PROGRESS) {
                        geocoderService.startGeoTracking();
                    } else {
                        geocoderService.stopGeoTracking();
                    }

                    vm.currentRequest = updatedRequest;
                    currentRequestService.setRequest(vm.currentRequest);
                });
        }
    }
})();