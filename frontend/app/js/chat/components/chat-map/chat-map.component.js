(function () {
    'use strict';

    var chatMapConfig = {
        controller: ChatMapController,
        controllerAs: 'vm',
        templateUrl: 'chat/components/chat-map/chat-map.html',
        replace: true,
        bindings: {
            selectedRequest: '='
        }
    };

    angular
        .module('app.chat')
        .component('chatMap', chatMapConfig);

    ChatMapController.$inject = ['$scope', 'uiGmapIsReady', 'coreConstants'];

    /* @ngInject */
    function ChatMapController($scope, uiGmapIsReady, coreConstants) {
        var vm = this;

        vm.requestStatus = coreConstants.REQUEST_STATUSES;

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
                }
            },
            marker: {
                center: {
                    latitude: vm.selectedRequest.location.latitude,
                    longitude: vm.selectedRequest.location.longitude
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
                visible: vm.selectedRequest.status !== vm.requestStatus.NEW,
                title: vm.selectedRequest.location.address
            }
        };

        activate();

        function refreshMap(location) {
            var mapsCount = angular.element(document).find('ui-gmap-google-map').length;

            return uiGmapIsReady.promise(mapsCount)
                .then(function () {
                    vm.map.center = {
                        latitude: location.latitude,
                        longitude: location.longitude
                    };

                    vm.map.circle.center = {
                        latitude: location.latitude,
                        longitude: location.longitude
                    };

                    vm.map.marker.center = {
                        latitude: location.latitude,
                        longitude: location.longitude
                    };

                    vm.map.marker.visible = vm.selectedRequest.status !== vm.requestStatus.NEW;

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

