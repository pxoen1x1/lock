(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('SpecialistRequestMapController', SpecialistRequestMapController);

    SpecialistRequestMapController.$inject = [
        '$scope',
        '$stateParams',
        'conf',
        'coreConstants',
        'chatSocketservice',
        'mobileService',
        'currentRequestService'
    ];

    /* @ngInject */
    function SpecialistRequestMapController($scope, $stateParams, conf, coreConstants, chatSocketservice, mobileService,
                                            currentRequestService) {
        var requestHandler;
        var currentRequestId = $stateParams.requestId;

        var vm = this;

        vm.request = {};

        vm.baseUrl = conf.BASE_URL;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);

        activate();

        function getRequest(requestId) {
            var request = {
                id: requestId
            };

            return currentRequestService.getRequest(request)
                .then(function (request) {

                    vm.request = request;

                    return vm.request;
                });
        }

        function listenRequestEvent() {
            requestHandler = chatSocketservice.onRequest(function (request, type) {
                if (type !== 'update' || vm.request.id !== request.id) {

                    return;
                }

                vm.request = request;
                currentRequestService.setRequest(vm.request);
            });
        }

        function activate() {
            getRequest(currentRequestId)
                .then(function () {
                    listenRequestEvent();
                });

            $scope.$on('$destroy', function () {
                chatSocketservice.offRequest(requestHandler);
            });
        }
    }
})();