(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestMapController', CustomerRequestMapController);

    CustomerRequestMapController.$inject = [
        '$state',
        '$stateParams',
        '$timeout',
        'conf',
        'coreConstants',
        'chatSocketservice',
        'currentRequestService',
        'geocoderService',
        'mobileService'
    ];

    /* @ngInject */
    function CustomerRequestMapController($state, $stateParams, $timeout, conf, coreConstants, chatSocketservice,
                                          currentRequestService, geocoderService, mobileService) {
        var currentRequestId = $stateParams.requestId;

        var vm = this;

        vm.request = {};
        vm.selectedSpecialist = {};
        vm.specialists = [];

        vm.isSpecialistCardShown = false;

        vm.baseUrl = conf.BASE_URL;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);

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

        function showSelectedSpecialistInfo(slectedSpecialist) {
            if (!slectedSpecialist || Object.keys(slectedSpecialist).length === 0 || !vm.request.location) {

                return;
            }

            if (!slectedSpecialist.distance) {
                var distance = geocoderService.getDistance(
                    vm.request.location.latitude,
                    vm.request.location.longitude,
                    slectedSpecialist.details.latitude,
                    slectedSpecialist.details.longitude
                );
            }

            vm.isSpecialistCardShown = false;

            $timeout(function () {
                vm.selectedSpecialist = slectedSpecialist;
                vm.selectedSpecialist.distance = distance ? distance : slectedSpecialist.distance;

                vm.isSpecialistCardShown = true;
            }, 200);
        }

        function createChat(selectedSpecialist, currentRequest) {
            if (currentRequest && currentRequest.status !== vm.requestStatus.NEW) {

                return;
            }

            var member = {
                member: selectedSpecialist
            };

            return chatSocketservice.createChat(vm.request, member)
                .then(function (createdChat) {
                    $state.go('customer.requests.request.chat',
                        {
                            requestId: vm.request.id,
                            chat: createdChat
                        }
                    );
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
                .then(function (request) {
                    if (request.status === vm.requestStatus.IN_PROGRESS) {
                        vm.isSpecialistCardShown = true;
                        vm.selectedSpecialist = request.executor;
                    }

                    listenRequestEvent();
                });
        }
    }
})();