(function () {
    'use strict';

    var requestInfoConfig = {
        controller: RequestInfoController,
        controllerAs: 'vm',
        templateUrl: 'chat/components/request-info/request-info.html',
        replace: true,
        bindings: {
            selectedRequest: '=',
            toggleSidenav: '&'
        }
    };

    angular
        .module('app.chat')
        .component('requestInfo', requestInfoConfig);

    RequestInfoController.$inject = ['$scope', 'uiGmapIsReady', 'coreConstants'];

    /* @ngInject */
    function RequestInfoController($scope, uiGmapIsReady, coreConstants) {
        var vm = this;

        vm.map = {
            center: {
                latitude: vm.selectedRequest.location.latitude,
                longitude: vm.selectedRequest.location.longitude
            },
            zoom: 15,
            control: {},
            options: {
                streetViewControl: false,
                maxZoom: 21,
                minZoom: 7
            },
            circle: {
                center: {
                    latitude: vm.selectedRequest.location.latitude,
                    longitude: vm.selectedRequest.location.longitude
                },
                radius: 500,
                stroke: {
                    color: '#039BE5',
                    weight: 1,
                    opacity: 0.5
                },
                fill: {
                    color: '#039BE5',
                    opacity: 0.3
                },
            }
        };

        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.close = close;

        activate();

        function close() {
            vm.toggleSidenav({navID: 'right-sidenav'});
        }

        function refreshMap(location) {
            return uiGmapIsReady.promise(1)
                .then(function () {

                    vm.map.circle.center = {
                        latitude: location.latitude,
                        longitude: location.longitude
                    };

                    vm.map.center = {
                        latitude: location.latitude,
                        longitude: location.longitude
                    };

                    vm.map.control.refresh(location);

                    return vm.map;
                });
        }

        function activate() {
            refreshMap(vm.selectedRequest.location);

            $scope.$watchCollection('vm.selectedRequest.location', function (newRequest, oldRequest) {
                if (!newRequest || newRequest === oldRequest) {

                    return;
                }

                refreshMap(vm.selectedRequest.location);
            });
        }
    }
})();

