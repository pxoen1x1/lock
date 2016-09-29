(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestMapController', CustomerRequestMapController);

    CustomerRequestMapController.$inject = ['$state', '$timeout', '$stateParams', 'uiGmapIsReady', 'coreConstants',
        'chatSocketservice', 'customerDataservice', 'requestService', 'geocoderService'];

    /* @ngInject */
    function CustomerRequestMapController($state, $timeout, $stateParams, uiGmapIsReady, coreConstants,
                                          chatSocketservice, customerDataservice, requestService, geocoderService) {
        var currentRequestId = $stateParams.requestId;
        var promises = {
            findSpecialists: null
        };
        var requestLocationMarker = {
            icon: {
                url: coreConstants.IMAGES.currentLocationMarker,
                scaledSize: {
                    width: 30,
                    height: 30
                },
                anchor: {
                    x: 15,
                    y: 15
                }
            },
            events: {
                mouseover: function (gMarker, eventName, model) {
                    model.show = true;
                },
                mouseout: function (gMarker, eventName, model) {
                    model.show = false;
                }
            },
            title: 'Your request',
            text: ''
        };
        var vm = this;

        vm.request = {};
        vm.currentRequest = {};
        vm.selectedSpecialist = {};
        vm.specialists = [];

        vm.boundsOfDistance = {};

        vm.isSpecialistCardShown = false;

        vm.map = {
            events: {
                idle: findSpecialists
            },
            center: {
                latitude: null,
                longitude: null
            },
            options: {
                streetViewControl: false,
                maxZoom: 21,
                minZoom: 7
            },
            specialistMarker: {
                options: {
                    icon: {
                        url: '/images/map-marker-locksmith.png',
                        scaledSize: {
                            width: 50,
                            height: 50
                        }
                    },
                    animation: 2
                },
                events: {
                    click: showSelectedSpecialistInfo
                }
            },
            markers: [],
            zoom: 16,
        };

        vm.status = coreConstants.REQUEST_STATUSES;

        vm.createChat = createChat;

        activate();

        function getRequest(requestId) {

            return requestService.getRequest(requestId)
                .then(function (request) {

                    vm.currentRequest = request;

                    return vm.currentRequest;
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

        function findSpecialists(gMarker) {
            if (vm.map.center.latitude === null && vm.map.center.longitude === null) {

                return;
            }

            var bounds = gMarker.getBounds();

            var boundsSouthWestLatitude = bounds.getSouthWest().lat();
            var boundsSouthWestLongitude = bounds.getSouthWest().lng();
            var boundsNorthEastLatitude = bounds.getNorthEast().lat();
            var boundsNorthEastLongitude = bounds.getNorthEast().lng();

            var selectedSouthWestLatitude = (boundsSouthWestLatitude < vm.boundsOfDistance.southWest.latitude) ?
                vm.boundsOfDistance.southWest.latitude : boundsSouthWestLatitude;
            var selectedSouthWestLongitude = (boundsSouthWestLongitude < vm.boundsOfDistance.southWest.longitude) ?
                vm.boundsOfDistance.southWest.longitude : boundsSouthWestLongitude;
            var selectedNorthEastLatitude = (boundsNorthEastLatitude > vm.boundsOfDistance.northEast.latitude) ?
                vm.boundsOfDistance.northEast.latitude : boundsNorthEastLatitude;
            var selectedNorthEastLongitude = (boundsNorthEastLongitude > vm.boundsOfDistance.northEast.longitude) ?
                vm.boundsOfDistance.northEast.longitude : boundsNorthEastLongitude;

            var params = {};

            params.southWestLatitude = selectedSouthWestLatitude;
            params.southWestLongitude = selectedSouthWestLongitude;
            params.northEastLatitude = selectedNorthEastLatitude;
            params.northEastLongitude = selectedNorthEastLongitude;
            params.isAllShown = vm.request.forDate ? true : null;

            return findSpecialistsByParams(params)
                .then(function (specialists) {
                    vm.specialists = specialists;

                    return vm.specialists;
                });
        }

        function setMapCenter(latitude, longitude) {
            vm.map.center.latitude = latitude;
            vm.map.center.longitude = longitude;
        }

        function showSelectedSpecialistInfo(marker, eventName, model) {
            if (!model.control || Object.keys(model.control).length === 0) {

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
            if (currentRequest) {

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

        function activate() {
            uiGmapIsReady.promise()
                .then(function () {

                    return getRequest(currentRequestId);
                })
                .then(function (request) {
                    vm.request = request;

                    requestLocationMarker.id = 0;
                    requestLocationMarker.latitude = vm.request.location.latitude;
                    requestLocationMarker.longitude = vm.request.location.longitude;
                    requestLocationMarker.text = vm.request.location.address;

                    vm.map.markers.push(requestLocationMarker);

                    vm.boundsOfDistance = geocoderService.getBoundsOfDistance(
                        vm.request.location.latitude,
                        vm.request.location.longitude,
                        vm.request.distance
                    );

                    setMapCenter(vm.request.location.latitude, vm.request.location.longitude);
                });
        }
    }
})();