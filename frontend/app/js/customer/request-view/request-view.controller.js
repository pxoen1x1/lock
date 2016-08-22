(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerViewRequestController', CustomerViewRequestController);

    CustomerViewRequestController.$inject = ['$stateParams', 'coreDataservice', 'coreConstants'];

    /* @ngInject */
    function CustomerViewRequestController($stateParams, coreDataservice, coreConstants) {
        var promises = {
            getRequest: null
        };

        var vm = this;
        
        vm.$stateParams = $stateParams;

        vm.request = {};

        vm.map = {
            center: {},
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

        vm.selectedRequestId = $stateParams.requestId;

        activate();

        function getRequestById(requestId) {
            if (promises.getRequest) {
                promises.getRequest.cancel();
            }

            promises.getRequest = coreDataservice.getRequest(requestId);

            return promises.getRequest
                .then(function (response) {

                    return response.data.request;
                });
        }

        function getRequest() {
            var selectedRequestId = {
                id: vm.selectedRequestId
            };

            getRequestById(selectedRequestId)
                .then(function (request) {
                    vm.request = request;

                    vm.map.center = vm.request.location;

                    return vm.request;
                });
        }

        function activate() {
            getRequest();
        }
    }
})();