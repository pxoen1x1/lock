(function () {
    'use strict';

    var clientMapViewerConfig = {
        controller: ClientMapViewerController,
        controllerAs: 'vm',
        templateUrl: 'customer/components/client-map-viewer/client-map-viewer.html',
        replace: true,
        bindings: {
            currentRequest: '<',
            mapOptions: '<?',
            isSpecialistHidden: '@',
            selectedSpecialist: '=?',
            showSpecialistInfo: '&?',
            hireSpecialist: '&?'
        }
    };

    angular
        .module('app.customer')
        .component('clientMapViewer', clientMapViewerConfig);

    ClientMapViewerController.$inject = [
        '$scope',
        '$window',
        'uiGmapIsReady',
        'coreConstants',
        'customerDataservice',
        'geocoderService',
        'conf'
    ];

    /* @ngInject */
    function ClientMapViewerController($scope, $window, uiGmapIsReady, coreConstants, customerDataservice,
                                       geocoderService, conf) {
        var promises = {
            findSpecialists: null
        };

        var directionsRendererOptions = {
            suppressMarkers: true,
            suppressPolylines: true,
            preserveViewport: true
        };
        var googleMaps;
        var directionsDisplay;
        var directionsService;
        var locationHandler;
        var requestLocationMarker = {
            icon: {
                url: coreConstants.IMAGES.requestLocationMarker,
                scaledSize: {
                    width: 30,
                    height: 30
                },
                anchor: {
                    x: 15,
                    y: 15
                }
            },
            events: {
                mouseover: function (gMarker, eventName, model) {
                    model.show = true;
                },
                mouseout: function (gMarker, eventName, model) {
                    model.show = false;
                }
            },
            title: 'Your request',
            text: ''
        };
        var boundsOfDistance;
        var vm = this;

        vm.selectedSpecialist = vm.selectedSpecialist || {};

        vm.map = {
            events: {},
            center: {
                latitude: coreConstants.DEFAULT_MAP_AREA.latitude,
                longitude: coreConstants.DEFAULT_MAP_AREA.longitude
            },
            control: {},
            options: {
                streetViewControl: false,
                maxZoom: 21,
                minZoom: 7
            },
            specialistMarker: {
                options: {
                    icon: {
                        url: coreConstants.IMAGES.locksmithLocationMarker,
                        scaledSize: {
                            width: 28,
                            height: 41
                        }
                    },
                    animation: 2
                },
                events: {
                    click: showSpecialistInfo
                }
            },
            markers: [],
            zoom: 16
        };

        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.hire = hire;

        activate();

        function initializeMap() {
            vm.mapOptions = vm.mapOptions || {};

            if (!vm.isSpecialistHidden) {
                vm.map.events.idle = findSpecialists;
            }

            vm.map.options = angular.extend(vm.map.options, vm.mapOptions);
            vm.map.zoom = vm.mapOptions.zoom || vm.map.zoom;
        }

        function findSpecialistsByParams(params) {
            if (promises.findSpecialists) {

                promises.findSpecialists.cancel();
            }

            promises.findSpecialists = customerDataservice.getSpecialists(params);

            return promises.findSpecialists
                .then(function (response) {

                    return response.data.serviceProviders;
                });

        }

        function findSpecialists(gMarker) {
            if (vm.map.center.latitude === null && vm.map.center.longitude === null ||
                vm.currentRequest.status !== vm.requestStatus.NEW) {

                return;
            }

            if (!boundsOfDistance) {
                boundsOfDistance = getBoundsOfDistance(vm.currentRequest);
                if(!boundsOfDistance) {

                    return;
                }
            }

            var bounds = gMarker.getBounds();

            var boundsSouthWestLatitude = bounds.getSouthWest().lat();
            var boundsSouthWestLongitude = bounds.getSouthWest().lng();
            var boundsNorthEastLatitude = bounds.getNorthEast().lat();
            var boundsNorthEastLongitude = bounds.getNorthEast().lng();

            var selectedSouthWestLatitude = (boundsSouthWestLatitude < boundsOfDistance.southWest.latitude) ?
                boundsOfDistance.southWest.latitude : boundsSouthWestLatitude;
            var selectedSouthWestLongitude = (boundsSouthWestLongitude < boundsOfDistance.southWest.longitude) ?
                boundsOfDistance.southWest.longitude : boundsSouthWestLongitude;
            var selectedNorthEastLatitude = (boundsNorthEastLatitude > boundsOfDistance.northEast.latitude) ?
                boundsOfDistance.northEast.latitude : boundsNorthEastLatitude;
            var selectedNorthEastLongitude = (boundsNorthEastLongitude > boundsOfDistance.northEast.longitude) ?
                boundsOfDistance.northEast.longitude : boundsNorthEastLongitude;

            var params = {};

            params.southWestLatitude = selectedSouthWestLatitude;
            params.southWestLongitude = selectedSouthWestLongitude;
            params.northEastLatitude = selectedNorthEastLatitude;
            params.northEastLongitude = selectedNorthEastLongitude;
            params.isAllShown = vm.currentRequest.forDate ? true : null;

            return findSpecialistsByParams(params)
                .then(function (specialists) {
                    vm.specialists = specialists;

                    return vm.specialists;
                });
        }

        function listenLocationEvent() {
            if (vm.currentRequest.status !== vm.requestStatus.IN_PROGRESS || vm.isSpecialistHidden) {

                return;
            }

            return customerDataservice.onLocation(function (location, type) {
                if (type !== 'update') {

                    return;
                }

                getDirections(location.latitude, location.longitude);
            });
        }

        function setRequestMarker(request) {
            if (!request.location) {

                return;
            }

            requestLocationMarker.id = request.location.id;
            requestLocationMarker.latitude = request.location.latitude;
            requestLocationMarker.longitude = request.location.longitude;
            requestLocationMarker.text = request.location.address;

            vm.map.markers[0] = requestLocationMarker ;

            if (request.status !== vm.requestStatus.IN_PROGRESS || vm.isSpecialistHidden) {
                setMapCenter(request.location.latitude, request.location.longitude);
            }
        }

        function setExecutorMarker(request) {
            if (!request || !request.executor || !request.executor.details ||
                request.status !== vm.requestStatus.IN_PROGRESS || vm.isSpecialistHidden) {

                return;
            }

            locationHandler = listenLocationEvent();

            vm.specialists = [request.executor];

            getDirections(request.executor.details.latitude, request.executor.details.longitude);
        }

        function setExecutorMarkerCenter(latitude, longitude) {
            if (!latitude || !longitude) {

                return;
            }

            if (!vm.specialists[0]) {
                vm.specialists[0] = {
                    details: {}
                };
            }

            vm.specialists[0].details.latitude = latitude;
            vm.specialists[0].details.longitude = longitude;
        }

        function showSpecialistInfo(marker, eventName, model) {

            vm.selectedSpecialist = angular.extend(vm.selectedSpecialist, model.control);

            if (vm.showSpecialistInfo) {

                vm.showSpecialistInfo({selectedSpecialist: vm.selectedSpecialist});
            }
        }

        function hire(specialist) {

            vm.hireSpecialist({specialist: specialist});
        }

        function setMapCenter(latitude, longitude) {
            if (!latitude || !longitude) {

                return;
            }

            vm.map.center.latitude = latitude;
            vm.map.center.longitude = longitude;
        }

        function getBoundsOfDistance(request) {
            if (!request.location || !request.distance) {

                return;
            }

            return geocoderService.getBoundsOfDistance(
                request.location.latitude,
                request.location.longitude,
                request.distance
            );
        }

        function getDirections(latitude, longitude) {
            if (!latitude || !longitude ||
                vm.currentRequest.status !== vm.requestStatus.IN_PROGRESS || vm.isDirectionsDisabled) {

                return;
            }

            var request = {
                origin: {
                    lat: latitude,
                    lng: longitude
                },
                destination: {
                    lat: vm.currentRequest.location.latitude,
                    lng: vm.currentRequest.location.longitude
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

                setExecutorMarkerCenter(leg.start_location.lat(), leg.start_location.lng());

                $scope.$applyAsync(function () {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                });

                setMapCenter(leg.start_location.lat(), leg.start_location.lng());

                vm.selectedSpecialist.distance = leg.distance.value / 1000 * coreConstants.DISTANCE.toMile;
                vm.selectedSpecialist.duration = leg.duration;
            });
        }

        function removeDirection() {
            if (!directionsDisplay) {

                return;
            }

            directionsDisplay.setMap(null);
        }

        function stopLocationEventListener(handler) {
            if (!handler) {

                return;
            }

            customerDataservice.offLocation(locationHandler);
        }

        function activate() {
            initializeMap();
            uiGmapIsReady.promise(1)
                .then(function () {
                    vm.map.control.refresh(location);

                    googleMaps = $window.google.maps;

                    directionsDisplay = new googleMaps.DirectionsRenderer(directionsRendererOptions);
                    directionsService = new googleMaps.DirectionsService();

                    setRequestMarker(vm.currentRequest);
                    setExecutorMarker(vm.currentRequest);

                    $scope.$watch('vm.currentRequest.status', function (newRequestStatus, oldRequestStatus) {
                        if (newRequestStatus === oldRequestStatus) {

                            return;
                        }

                        if (vm.currentRequest.status === vm.requestStatus.IN_PROGRESS) {
                            delete vm.map.specialistMarker.options.animation;

                            setExecutorMarker(vm.currentRequest);
                        } else {
                            vm.map.specialistMarker.options.animation = 2;
                            vm.specialists = [];

                            removeDirection();
                            setMapCenter(vm.currentRequest.location.latitude, vm.currentRequest.location.longitude);
                            stopLocationEventListener(locationHandler);
                        }
                    });

                    $scope.$watch('vm.currentRequest.location.address', function (newLocation, oldLocation) {
                        if(newLocation === oldLocation) {

                            return;
                        }

                        setRequestMarker(vm.currentRequest);
                    });
                });

            $scope.$on('$destroy', function () {
                stopLocationEventListener(locationHandler);
            });
        }
    }
})();