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
                vm.stopGeoTracking();
                element.remove();
            });
        }
    }

    MapViewerController.$inject = [
        '$scope',
        '$q',
        '$timeout',
        '$window',
        'uiGmapIsReady',
        'coreConstants',
        'geocoderService'
    ];

    /* @ngInject */
    function MapViewerController($scope, $q, $timeout, $window, uiGmapIsReady, coreConstants, geocoderService) {
        var googleMaps;
        var directionsDisplay;
        var directionsService;
        var promiseStartGeoTracking;

        var updateCurrentLocationDelay = coreConstants.UPDATE_CURRENT_LOCATION_DELAY;

        var directionsRendererOptions = {
            suppressMarkers: true,
            preserveViewport: true
        };

        var currentLocation = {
            lat: null,
            lng: null
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
        vm.goToLocation = goToLocation;
        vm.getDirections = getDirections;
        vm.stopGeoTracking = stopGeoTracking;

        function refreshMap(location) {
            var mapsCount = angular.element(document).find('ui-gmap-google-map').length;

            return uiGmapIsReady.promise(mapsCount)
                .then(function () {
                    vm.map.center = {
                        latitude: location.latitude,
                        longitude: location.longitude
                    };

                    setRequestMarkerCenter(location.latitude, location.longitude);

                    vm.map.control.refresh(vm.map.center);

                    return vm.map;
                });
        }

        function goToLocation(latitude, longitude) {
            if (!latitude || !longitude) {

                return;
            }

            vm.map.center = {
                latitude: latitude,
                longitude: longitude
            };
        }

        function getCurrentPosition() {

            return geocoderService.getCurrentCoordinates()
                .then(function (position) {
                    currentLocation = {
                        lat: position.latitude,
                        lng: position.longitude
                    };

                    return position;
                })
                .then(getDirections);
        }

        function setCurrentMarkerCenter(latitude, longitude) {
            if (!latitude || !longitude) {

                return;
            }

            vm.map.currentMarker.center = {
                latitude: latitude,
                longitude: longitude
            };
        }

        function getDirections() {
            if (vm.selectedRequest.status !== vm.requestStatus.IN_PROGRESS) {

                return;
            }

            var request = {
                origin: currentLocation,
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

                var endLocation = {
                    latitude: leg.end_location.lat(),
                    longitude: leg.end_location.lng()
                };

                var startLocation = {
                    latitude: leg.start_location.lat(),
                    longitude: leg.start_location.lng()
                };

                setRequestMarkerCenter(endLocation.latitude, endLocation.longitude);
                setCurrentMarkerCenter(startLocation.latitude, startLocation.longitude);

                vm.map.center = {
                    latitude: startLocation.latitude,
                    longitude: startLocation.longitude
                };
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

            setRequestMarkerCenter(vm.selectedRequest.location.latitude, vm.selectedRequest.location.longitude);
            setCurrentMarkerCenter(currentLocation.lat, currentLocation.lng);

            stopGeoTracking();
        }

        function startGeoTracking() {
            if (vm.selectedRequest.status !== vm.requestStatus.IN_PROGRESS) {

                return $q.reject();
            }

            return getCurrentPosition()
                .then(function () {
                    promiseStartGeoTracking = $timeout(function () {
                        startGeoTracking();

                        return promiseStartGeoTracking;
                    }, updateCurrentLocationDelay);
                });
        }

        function stopGeoTracking() {
            $timeout.cancel(promiseStartGeoTracking);
        }

        function setRequestMarkerCenter(latitude, longitude) {
            if (!latitude || !longitude) {
                return;
            }

            vm.map.requestMarker.center = {
                latitude: latitude,
                longitude: longitude
            };
        }

        function activate() {
            refreshMap(vm.selectedRequest.location)
                .then(function () {
                    googleMaps = $window.google.maps;

                    directionsDisplay = new googleMaps.DirectionsRenderer(directionsRendererOptions);
                    directionsService = new googleMaps.DirectionsService();

                    return startGeoTracking();
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
                    startGeoTracking();
                }
                else {
                    removeDirection();
                }
            });
        }
    }
})();

