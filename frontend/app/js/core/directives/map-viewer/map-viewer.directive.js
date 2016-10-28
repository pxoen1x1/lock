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

            var fullScreenModeDisabled = typeof attrs.fullscreenDisabled !== 'undefined' &&
                attrs.fullscreenDisabled !== 'false';

            vm.toggleFullScreenMode = toggleFullScreenMode;

            function toggleFullScreenMode() {
                if (fullScreenModeDisabled) {

                    return;
                }

                vm.isFullScreenMode = !vm.isFullScreenMode;
                var sideBar = angular.element(document.querySelector('md-sidenav.menu'));
                var headerToolbar = angular.element(document.querySelector('.header md-toolbar'));

                if (vm.isFullScreenMode) {
                    sideBar.css('z-index', '1');
                    headerToolbar.css('z-index', '1');
                } else {
                    sideBar.css('z-index', '');
                    headerToolbar.css('z-index', '');
                }

                element.toggleClass('full-screen');

                vm.refreshMap(vm.selectedRequest.location);
            }

            scope.$on('$destroy', function () {
                vm.removeDirection();
                element.remove();
            });
        }
    }

    MapViewerController.$inject = [
        '$scope',
        '$timeout',
        '$window',
        'uiGmapIsReady',
        'coreConstants',
        'geocoderService'
    ];

    /* @ngInject */
    function MapViewerController($scope, $timeout, $window, uiGmapIsReady, coreConstants, geocoderService) {
        var googleMaps;
        var directionsDisplay;
        var directionsService;
        var promiseStartGeoTracking;
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
                center: {
                    latitude: vm.selectedRequest.location.latitude,
                    longitude: vm.selectedRequest.location.longitude
                },
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
        vm.removeDirection =removeDirection;

        function refreshMap(location) {
            var mapsCount = angular.element(document).find('ui-gmap-google-map').length;

            return uiGmapIsReady.promise(mapsCount)
                .then(function () {
                    vm.map.center = {
                        latitude: location.latitude,
                        longitude: location.longitude
                    };

                    vm.map.requestMarker.center = {
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

            vm.currentLocation = {
                lat: position.latitude,
                lng: position.longitude
            };

            vm.map.currentMarker.center = {
                latitude: vm.currentLocation.lat,
                longitude: vm.currentLocation.lng
            };
        }

        function getDirections() {
            if (vm.selectedRequest.status !== vm.requestStatus.IN_PROGRESS) {

                return;
            }

            var request = {
                origin: vm.currentLocation,
                destination: {
                    lat: vm.selectedRequest.location.latitude,
                    lng: vm.selectedRequest.location.longitude
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

                var map = vm.map.control.getGMap();
                var leg = response.routes[0].legs[0];

                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);

                vm.map.requestMarker.center = {
                    latitude: leg.end_location.lat(),
                    longitude: leg.end_location.lng()
                };

                vm.map.currentMarker.center = {
                    latitude: leg.start_location.lat(),
                    longitude: leg.start_location.lng()
                };

                startGeoTracking();
            });
        }

        function removeDirection() {
            if (!directionsDisplay) {

                return;
            }

            directionsDisplay.setMap(null);

            vm.map.center = {
                latitude: vm.selectedRequest.location.latitude,
                longitude: vm.selectedRequest.location.longitude
            };

            vm.map.requestMarker.center = {
                latitude: vm.selectedRequest.location.latitude,
                longitude: vm.selectedRequest.location.longitude
            };

            vm.map.currentMarker.center = {
                latitude: vm.currentLocation.lat,
                longitude: vm.currentLocation.lng
            };

            $timeout.cancel(promiseStartGeoTracking);
        }

        function startGeoTracking() {

            promiseStartGeoTracking = $timeout(function () {
                return getCurrentPosition();
            }, 15000)
                .then(startGeoTracking);
        }

        function activate() {
            refreshMap(vm.selectedRequest.location)
                .then(function () {
                    var options = {
                        suppressMarkers: true
                    };

                    googleMaps = $window.google.maps;

                    directionsDisplay = new googleMaps.DirectionsRenderer(options);
                    directionsService = new googleMaps.DirectionsService();

                    return getCurrentPosition();
                })
                .then(getDirections);

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

