(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('mapViewer', mapViewer);

    function mapViewer() {
        var directive = {
            bindToController: true,
            controller: MapViewerController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
                selectedRequest: '='
            },
            templateUrl: 'core/directives/map-viewer/map-viewer.html',
            replace: true
        };

        return directive;

        function link(scope, element, attrs) {
            var vm = scope.vm;

            vm.isFullScreenMode = false;

            var fullScreenModeDisabled = attrs.fullscreenDisabled && attrs.fullscreenDisabled !== 'false';

            vm.toggleFullScreenMode = toggleFullScreenMode;

            function toggleFullScreenMode() {
                if (fullScreenModeDisabled) {

                    return;
                }

                vm.isFullScreenMode = !vm.isFullScreenMode;
                var sideBar = angular.element(document.querySelector('md-sidenav.menu'));
                var headerToolbar = angular.element(document.querySelector('.header md-toolbar'));

                if (vm.isFullScreenMode) {
                    element.removeClass('bounceOut');
                    sideBar.css('z-index', '1');
                    headerToolbar.css('z-index', '1');
                } else {
                    element.addClass('bounceOut');
                    sideBar.css('z-index', '');
                    headerToolbar.css('z-index', '');
                }

                element.toggleClass('full-screen bounceIn');

                vm.refreshMap(vm.selectedRequest.location);
            }

            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    }

    MapViewerController.$inject = ['$scope', '$window', 'uiGmapIsReady', 'coreConstants', 'geocoderService'];

    /* @ngInject */
    function MapViewerController($scope, $window, uiGmapIsReady, coreConstants, geocoderService) {
        var googleMaps;
        var directionsDisplay;
        var directionsService;
        var currentPosition = {
            latitude: null,
            longitude: null
        };
        var vm = this;

        vm.requestStatus = coreConstants.REQUEST_STATUSES;

        vm.map = {
            center: {
                latitude: vm.selectedRequest.location.latitude,
                longitude: vm.selectedRequest.location.longitude
            },
            zoom: 15,
            control: {},
            events: {
                dblclick: function () {
                    vm.toggleFullScreenMode();
                }
            },
            options: {
                disableDoubleClickZoom: true,
                streetViewControl: false,
                maxZoom: 21,
                minZoom: 7
            },
            circle: {
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
            requestMarker: {
                icon: {
                    url: coreConstants.IMAGES.requestLocationMarker,
                    scaledSize: {
                        width: 30,
                        height: 30
                    },
                    anchor: {
                        x: 15, y: 15
                    }
                },
                title: vm.selectedRequest.location.address
            },
            currentMarker: {
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
                title: 'You are here.'
            }
        };

        activate();

        vm.refreshMap = refreshMap;
        vm.goToCurrentPosition = goToCurrentPosition;
        vm.getDirections = getDirections;

        function refreshMap(location) {
            var mapsCount = angular.element(document).find('ui-gmap-google-map').length;

            return uiGmapIsReady.promise(mapsCount)
                .then(function () {
                    vm.map.center = {
                        latitude: location.latitude,
                        longitude: location.longitude
                    };

                    vm.map.control.refresh(vm.map.center);

                    return vm.map;
                });
        }

        function goToCurrentPosition() {
            if (!currentPosition.latitude || !currentPosition.longitude) {

                return;
            }

            vm.map.center = {
                latitude: currentPosition.latitude,
                longitude: currentPosition.longitude
            };
        }

        function getCurrentPosition() {

            return geocoderService.getCurrentCoordinates()
                .then(function (position) {
                    currentPosition = {
                        latitude: position.latitude,
                        longitude: position.longitude
                    };

                    setCurrentMarkerCenter(currentPosition);

                    return position;
                });
        }

        function setCurrentMarkerCenter(position) {
            if (!position.latitude || !position.longitude) {

                return;
            }

            vm.map.currentMarker.center = position;
        }

        function getDirections() {
            if (vm.selectedRequest.status !== vm.requestStatus.IN_PROGRESS) {

                return;
            }

            var request = {
                origin: {
                    lat: vm.selectedRequest.location.latitude,
                    lng: vm.selectedRequest.location.longitude
                },
                destination: {
                    lat: vm.map.currentMarker.center.latitude,
                    lng: vm.map.currentMarker.center.longitude
                },
                travelMode: googleMaps.DirectionsTravelMode.DRIVING,
                drivingOptions: {
                    departureTime: new Date(),
                    trafficModel: 'pessimistic'
                },
                unitSystem: googleMaps.UnitSystem.IMPERIAL
            };

            directionsService.route(request, function (response, status) {
                if (status !== googleMaps.DirectionsStatus.OK) {

                    return;
                }

                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(vm.map.control.getGMap());
            });
        }

        function removeDirection() {
            directionsDisplay.setMap(null);
        }

        function activate() {
            refreshMap(vm.selectedRequest.location)
                .then(function () {
                    googleMaps = $window.google.maps;
                    directionsDisplay = new googleMaps.DirectionsRenderer();
                    directionsService = new googleMaps.DirectionsService();

                    return getCurrentPosition();
                })
                .then(getDirections)
                .catch(function (error) {
                    console.log(error);
                });

            $scope.$watchCollection('vm.selectedRequest.location', function (newLocation, oldLocation) {
                if (!newLocation || newLocation === oldLocation) {

                    return;
                }

                $scope.$applyAsync(function () {
                    refreshMap(newLocation);
                });
            });

            $scope.$watch('vm.selectedRequest.status', function (newStatus, oldStatus) {
                if (newStatus === oldStatus) {

                    return;
                }

                if (vm.selectedRequest.status === vm.requestStatus.IN_PROGRESS) {
                    getDirections();
                }
                else {
                    removeDirection();
                }
            });
        }
    }
})();

