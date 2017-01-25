(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestRecommendedController', CustomerRequestRecommendedController);

    CustomerRequestRecommendedController.$inject = [
        '$state',
        '$stateParams',
        'conf',
        'coreConstants',
        'currentRequestService',
        'geocoderService',
        'chatSocketservice',
        'customerDataservice',
        'mobileService'
    ];

    /* @ngInject */
    function CustomerRequestRecommendedController($state, $stateParams, conf, coreConstants, currentRequestService,
                                                  geocoderService, chatSocketservice, customerDataservice,
                                                  mobileService) {
        var currentRequestId = $stateParams.requestId;
        var promises = {
            findSpecialists: null
        };
        var vm = this;

        vm.showOnlyAvailable = false;
        vm.request = {};
        vm.specialists = [];

        vm.baseUrl = conf.BASE_URL;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);

        vm.findSpecialists = findSpecialists;
        vm.createChat = createChat;

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

        function findSpecialistsByParams(params) {
            if (promises.findSpecialists) {
                promises.findSpecialists.cancel();
            }

            promises.findSpecialists = customerDataservice.getSpecialists(params);

            return promises.findSpecialists
                .then(function (response) {

                    return response.data.serviceProviders;
                });
        }

        function findSpecialists() {
            var params = {};

            params.southWestLatitude = vm.boundsOfDistance.southWest.latitude;
            params.southWestLongitude = vm.boundsOfDistance.southWest.longitude;
            params.northEastLatitude = vm.boundsOfDistance.northEast.latitude;
            params.northEastLongitude = vm.boundsOfDistance.northEast.longitude;
            params.isAllShown = !vm.showOnlyAvailable;

            return findSpecialistsByParams(params)
                .then(function (specialists) {
                    vm.specialists = specialists.map(function (specialist) {
                            specialist.distance = getSpecialistDistance(specialist);

                            return specialist;
                        }
                    );

                    vm.specialists.sort(function (a, b) {
                        return a.details.rating < b.details.rating;
                    });

                    return vm.specialists;
                });
        }

        function getSpecialistDistance(specialist) {
            var distance = geocoderService.getDistance(
                vm.request.location.latitude,
                vm.request.location.longitude,
                specialist.details.latitude,
                specialist.details.longitude
            );

            return distance;
        }

        function createChat(selectedSpecialist, currentRequest) {
            if (currentRequest && currentRequest.status !== vm.requestStatus.NEW) {

                return;
            }

            var member = {
                member: selectedSpecialist
            };

            return chatSocketservice.createChat(vm.request, member)
                .then(function () {
                    $state.go('customer.requests.request.chat');
                });
        }

        function activate() {
            getRequest(currentRequestId)
                .then(function () {
                    vm.boundsOfDistance = geocoderService.getBoundsOfDistance(
                        vm.request.location.latitude,
                        vm.request.location.longitude,
                        vm.request.distance
                    );

                    findSpecialists();
                });
        }
    }
})();