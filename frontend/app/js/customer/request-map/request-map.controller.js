(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestMapController', CustomerRequestMapController);

    CustomerRequestMapController.$inject = [
        '$state',
        '$timeout',
        '$stateParams',
        'uiGmapIsReady',
        'coreConstants',
        'chatSocketservice',
        'customerDataservice',
        'currentRequestService',
        'geocoderService',
        'conf'
    ];

    /* @ngInject */
    function CustomerRequestMapController($state, $timeout, $stateParams, uiGmapIsReady, coreConstants,
                                          chatSocketservice, customerDataservice, currentRequestService,
                                          geocoderService, conf) {
        var currentRequestId = $stateParams.requestId;

        var vm = this;

        vm.request = {};
        vm.selectedSpecialist = {};
        vm.specialists = [];

        vm.isSpecialistCardShown = false;

        vm.baseUrl = conf.BASE_URL;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;

        vm.createChat = createChat;
        vm.showSelectedSpecialistInfo = showSelectedSpecialistInfo;

        activate();

        function getRequest(requestId) {
            var request = {
                id: requestId
            };

            return currentRequestService.getRequest(request)
                .then(function (request) {

                    vm.request = request;
                    currentRequestService.setRequest(vm.request);

                    return vm.request;
                });
        }

        function showSelectedSpecialistInfo(marker, eventName, model) {
            if (!model.control || Object.keys(model.control).length === 0 || !vm.request.location) {

                return;
            }

            var distance = geocoderService.getDistance(
                vm.request.location.latitude,
                vm.request.location.longitude,
                model.control.details.latitude,
                model.control.details.longitude
            );

            vm.isSpecialistCardShown = false;

            $timeout(function () {
                vm.selectedSpecialist = model.control;
                vm.selectedSpecialist.distance = distance;

                vm.isSpecialistCardShown = true;
            }, 200);
        }

        function createChat(selectedSpecialist, currentRequest) {
            if (currentRequest && currentRequest.status !== vm.requestStatus.NEW) {

                return;
            }

            var specialist = {
                specialist: selectedSpecialist
            };

            return chatSocketservice.createChat(vm.request, specialist)
                .then(function () {
                    $state.go('customer.requests.request.chat');
                });
        }

        function listenRequestEvent() {
            chatSocketservice.onRequest(function (request, type) {
                if (type !== 'update' || vm.request.id !== request.id) {

                    return;
                }

                vm.request = request;
                currentRequestService.setRequest(vm.request);

                if (request.status !== vm.requestStatus.NEW) {
                    vm.specialists = [];
                }
            });
        }

        function activate() {
            getRequest(currentRequestId)
                .then(function () {
                    listenRequestEvent();
                });
        }
    }
})();