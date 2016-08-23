(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestMapController', CustomerRequestMapController);

    CustomerRequestMapController.$inject = ['$stateParams', 'uiGmapIsReady', 'coreConstants', 'requestService'];

    /* @ngInject */
    function CustomerRequestMapController($stateParams, uiGmapIsReady, coreConstants, requestService) {
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
            title: 'Your request',
            text: ''
        };
        var vm = this;

        vm.request = {};
        vm.serviceproviders = [];

        vm.selectedRequestId = $stateParams.requestId;

        vm.isSpecialistCardShown = false;
        vm.isAvailableSpecialistShown = false;

        vm.map = {
            center: {
                latitude: null,
                longitude: null
            },
            options: {
                streetViewControl: false
            },
            markers: [],
            zoom: 16,
        };

        activate();

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