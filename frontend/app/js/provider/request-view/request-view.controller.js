(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderViewRequestController', ProviderViewRequestController);

    ProviderViewRequestController.$inject = ['$stateParams', 'coreConstants', 'serviceProviderDataservice', 'requestService'];

    /* @ngInject */
    function ProviderViewRequestController($stateParams, coreConstants, serviceProviderDataservice, requestService) {
        var promises = {
            getRequest: null
        };

        var vm = this;

        vm.request = {};

        vm.currentRequestId = $stateParams.requestId;

        vm.map = {
            center: {
                latitude: null,
                longitude: null
            },
            zoom: 14,
            options: {
                scrollwheel: false,
                streetViewControl: false,
                disableDefaultUI: true,
                draggable: false,
                zoomControl: false,
                disableDoubleClickZoom: true
            },
            marker: {
                center: {
                    latitude: null,
                    longitude: null
                },
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
                title: 'Your request'
            }
        };

        vm.dateFormat = coreConstants.DATE_FORMAT;

        activate();

        function getRequestById(request) {
            if (promises.getRequest) {
                promises.getRequest.cancel();
            }

            promises.getRequest = serviceProviderDataservice.getRequest(request);

            return promises.getRequest
                .then(function (response) {

                    return response.data.request;
                });
        }

        function getRequest() {
            var currentRequest = {
                id: vm.currentRequestId
            };

            getRequestById(currentRequest)
                .then(function (request) {
                    vm.request = request;
                    requestService.setRequest(vm.request);

                    vm.map.center.latitude = vm.request.location.latitude;
                    vm.map.center.longitude = vm.request.location.longitude;


                    return vm.request;
                });
        }

        function activate() {
            getRequest();
        }
    }
})();