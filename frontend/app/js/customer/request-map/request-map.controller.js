(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestMapController', CustomerRequestMapController);

    CustomerRequestMapController.$inject = ['$stateParams', 'uiGmapIsReady', 'coreConstants',
        'customerDataservice', 'requestService'];

    /* @ngInject */
    function CustomerRequestMapController($stateParams, uiGmapIsReady, coreConstants,
                                          customerDataservice, requestService) {
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
                    x: 15, y: 15
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
        vm.specialsits = [];

        vm.selectedRequestId = $stateParams.requestId;

        vm.isSpecialistCardShown = false;
        vm.isAvailableSpecialistShown = false;

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
                maxZoom: 18,
                minZoom: 12
            },
            markers: [],
            zoom: 16,
        };

        activate();

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

            var params = {
                southWestLatitude: bounds.getSouthWest().lat(),
                southWestLongitude: bounds.getSouthWest().lng(),
                northEastLatitude: bounds.getNorthEast().lat(),
                northEastLongitude: bounds.getNorthEast().lng(),
                distance: vm.request.distance
            };

            return findSpecialistsByParams(params)
                .then(function (specialists) {
                    vm.specialsits = specialists;

                    return vm.specialsits;
                });
        }

        function setMapCenter(latitude, longitude) {
            vm.map.center.latitude = latitude;
            vm.map.center.longitude = longitude;
        }

        function activate() {
            uiGmapIsReady.promise()
                .then(function () {

                    return requestService.getRequest(vm.selectedRequestId);
                })
                .then(function (request) {
                    vm.request = request;

                    requestLocationMarker.id = 0;
                    requestLocationMarker.latitude = vm.request.location.latitude;
                    requestLocationMarker.longitude = vm.request.location.longitude;
                    requestLocationMarker.text = vm.request.location.address;

                    vm.map.markers.push(requestLocationMarker);

                    setMapCenter(vm.request.location.latitude, vm.request.location.longitude);
                });
        }
    }
})();