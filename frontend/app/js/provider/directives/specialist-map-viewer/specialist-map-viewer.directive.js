(function () {
    'use strict';

    angular
        .module('app.provider')
        .directive('specialistMapViewer', specialistMapViewer);

    function specialistMapViewer() {
        var directive = {
            bindToController: true,
            controller: SpecialistMapViewerController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
                selectedRequest: '=',
                mapOptions: '<?'
            },
            templateUrl: 'provider/directives/specialist-map-viewer/specialist-map-viewer.html',
            replace: true
        };

        return directive;

        function link(scope, element, attrs) {
            var fullScreenModeDisabled = typeof attrs.fullscreenDisabled !== 'undefined' &&
                attrs.fullscreenDisabled !== 'false';
            var vm = scope.vm;

            vm.isFullScreenMode = false;

            vm.isDirectionsDisabled = attrs.isDirectionsDisabled === 'true';
            vm.isActionButtonsHidden = attrs.isActionButtonsHidden === 'true';

            vm.toggleFullScreenMode = toggleFullScreenMode;

            function toggleFullScreenMode() {
                if (fullScreenModeDisabled) {

                    return;
                }

                vm.isFullScreenMode = !vm.isFullScreenMode;
                var sideBar = angular.element(document.querySelector('md-sidenav.menu'));
                var headerToolbar = angular.element(document.querySelector('.header md-toolbar'));
                var tabBar = angular.element(document.querySelector('.content tab-bar'));

                if (vm.isFullScreenMode) {
                    sideBar.css('z-index', '1');
                    headerToolbar.css('z-index', '1');
                    tabBar.css('z-index', '0');
                } else {
                    sideBar.css('z-index', '');
                    headerToolbar.css('z-index', '');
                    tabBar.css('z-index', '');
                }

                element.toggleClass('full-screen');

                vm.refreshMap(vm.map.center);
            }

            scope.$on('$destroy', function () {
                vm.stopGeoTracking();
                element.remove();
            });
        }
    }

    SpecialistMapViewerController.$inject = [
        '$scope',
        '$q',
        '$timeout',
        '$window',
        'uiGmapIsReady',
        'coreConstants',
        'geocoderService'
    ];

    /* @ngInject */
    function SpecialistMapViewerController($scope, $q, $timeout, $window, uiGmapIsReady, coreConstants,
                                           geocoderService) {
        var googleMaps;
        var directionsDisplay;
        var directionsService;
        var promiseStartGeoTracking;

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
        vm.goToLocation = setMapCenter;
        vm.getDirections = getDirections;
        vm.stopGeoTracking = stopGeoTracking;

        function refreshMap(location) {
            var mapsCount = angular.element(document).find('ui-gmap-google-map').length;

            return uiGmapIsReady.promise(mapsCount)
                .then(function () {
                    if (!location.latitude || !location.longitude) {

                        return;
                    }

                    setMapCenter(location.latitude, location.longitude);
                    setRequestMarkerCenter(location.latitude, location.longitude);

                    vm.map.control.refresh(location);

                    return vm.map;
                });
        }

        function getCurrentPosition() {

            return geocoderService.getCurrentCoordinates()
                .then(function (position) {
                    currentLocation = {
                        lat: position.latitude,
                        lng: position.longitude
                    };

                    return position;
                });
        }

        function getDirections() {
            var deferred = $q.defer();

            if (vm.selectedRequest.status !== vm.requestStatus.IN_PROGRESS || vm.isDirectionsDisabled) {

                return deferred.reject();
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

                    return deferred.reject();
                }

                var map = vm.map.control.getGMap();
                var leg = response.routes[0].legs[0];

                var endLocation = {
                    latitude: leg.end_location.lat(),
                    longitude: leg.end_location.lng()
                };

                var startLocation = {
                    latitude: leg.start_location.lat(),
                    longitude: leg.start_location.lng()
                };

                setCurrentMarkerCenter(startLocation.latitude, startLocation.longitude);
                setRequestMarkerCenter(endLocation.latitude, endLocation.longitude);

                $scope.$applyAsync(function () {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                });

                setMapCenter(startLocation.latitude, startLocation.longitude);

                deferred.resolve();
            });

            return deferred.promise;
        }

        function removeDirection() {
            if (!directionsDisplay) {

                return;
            }

            directionsDisplay.setMap(null);

            setMapCenter(vm.selectedRequest.location.latitude, vm.selectedRequest.location.longitude);
        }

        function startGeoTracking() {
            if (vm.selectedRequest.status !== vm.requestStatus.IN_PROGRESS || vm.isDirectionsDisabled) {

                return $q.reject();
            }

            return getCurrentPosition()
                .then(getDirections)
                .finally(function () {
                    promiseStartGeoTracking = $timeout(function () {
                        startGeoTracking();

                        return promiseStartGeoTracking;
                    }, 5000);
                });
        }

        function stopGeoTracking() {
            $timeout.cancel(promiseStartGeoTracking);
        }

        function setMapCenter(latitude, longitude) {
            if (!latitude || !longitude) {
                return;
            }

            vm.map.center = {
                latitude: latitude,
                longitude: longitude
            };
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

        function setCurrentMarkerCenter(latitude, longitude) {
            if (!latitude || !longitude) {

                return;
            }

            vm.map.currentMarker.center = {
                latitude: latitude,
                longitude: longitude
            };
        }

        function initializeMap() {
            vm.mapOptions = vm.mapOptions || {};

            vm.map.options = angular.extend(vm.map.options, vm.mapOptions);
            vm.map.zoom = vm.mapOptions.zoom || vm.map.zoom;
        }

        function activate() {
            initializeMap();
            refreshMap(vm.selectedRequest.location)
                .then(function () {
                    vm.map.options = angular.extend(vm.map.options, vm.mapOptions);
                    vm.map.zoom = vm.mapOptions.zoom || vm.map.zoom;

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

                if (vm.selectedRequest.status === vm.requestStatus.IN_PROGRESS && !vm.isDirectionsDisabled) {
                    startGeoTracking();
                }
                else {
                    removeDirection();

                    setRequestMarkerCenter(vm.selectedRequest.location.latitude, vm.selectedRequest.location.longitude);
                    setCurrentMarkerCenter(currentLocation.lat, currentLocation.lng);

                    stopGeoTracking();
                }
            });
        }
    }
})();

