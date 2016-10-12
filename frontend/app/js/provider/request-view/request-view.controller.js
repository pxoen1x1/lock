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

        vm.currentRequestId = $stateParams.requestId;

        activate();

        function getRequestById(requestId) {
            if (promises.getRequest) {
                promises.getRequest.cancel();
            }

            promises.getRequest = serviceProviderDataservice.getRequest(requestId);

            return promises.getRequest
                .then(function (response) {

                    return response.data.request;
                });
        }

        function getRequest() {
            var currentRequestId = {
                id: vm.currentRequestId
            };

            getRequestById(currentRequestId)
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