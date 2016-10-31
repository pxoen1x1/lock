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
            showSpecialistInfo: '&?'
        }
    };

    angular
        .module('app.customer')
        .component('clientMapViewer', clientMapViewerConfig);

    ClientMapViewerController.$inject = [
        '$scope',
        'uiGmapIsReady',
        'coreConstants',
        'customerDataservice',
        'geocoderService'
    ];

    /* @ngInject */
    function ClientMapViewerController($scope, uiGmapIsReady, coreConstants, customerDataservice,
                                       geocoderService) {
        var promises = {
            findSpecialists: null
        };
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
        var vm = this;

        vm.boundsOfDistance = {};
        vm.mapOptions = vm.mapOptions || {};

        vm.map = {
            events: {},
            center: {
                latitude: null,
                longitude: null
            },
            options: {
                streetViewControl: false,
                maxZoom: 21,
                minZoom: 7
            },
            specialistMarker: {
                options: {
                    icon: {
                        url: '/images/map-marker-locksmith.png',
                        scaledSize: {
                            width: 50,
                            height: 50
                        }
                    },
                    animation: 2
                },
                events: {
                    click: showSpecialistInfo
                }
            },
            markers: [],
            zoom: 16,
        };

        vm.requestStatus = coreConstants.REQUEST_STATUSES;

        activate();

        function initializeMap() {
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

            var bounds = gMarker.getBounds();

            var boundsSouthWestLatitude = bounds.getSouthWest().lat();
            var boundsSouthWestLongitude = bounds.getSouthWest().lng();
            var boundsNorthEastLatitude = bounds.getNorthEast().lat();
            var boundsNorthEastLongitude = bounds.getNorthEast().lng();

            var selectedSouthWestLatitude = (boundsSouthWestLatitude < vm.boundsOfDistance.southWest.latitude) ?
                vm.boundsOfDistance.southWest.latitude : boundsSouthWestLatitude;
            var selectedSouthWestLongitude = (boundsSouthWestLongitude < vm.boundsOfDistance.southWest.longitude) ?
                vm.boundsOfDistance.southWest.longitude : boundsSouthWestLongitude;
            var selectedNorthEastLatitude = (boundsNorthEastLatitude > vm.boundsOfDistance.northEast.latitude) ?
                vm.boundsOfDistance.northEast.latitude : boundsNorthEastLatitude;
            var selectedNorthEastLongitude = (boundsNorthEastLongitude > vm.boundsOfDistance.northEast.longitude) ?
                vm.boundsOfDistance.northEast.longitude : boundsNorthEastLongitude;

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

        function setMapCenter(latitude, longitude) {
            if (!latitude || !longitude) {

                return;
            }

            vm.map.center.latitude = latitude;
            vm.map.center.longitude = longitude;
        }

        function setRequestMarker(request) {
            if (!request.location) {

                return;
            }

            requestLocationMarker.id = request.location.id;
            requestLocationMarker.latitude = request.location.latitude;
            requestLocationMarker.longitude = request.location.longitude;
            requestLocationMarker.text = request.location.address;

            vm.map.markers.push(requestLocationMarker);

            if (request.status !== vm.requestStatus.IN_PROGRESS || vm.isSpecialistHidden) {
                setMapCenter(request.location.latitude, request.location.longitude);
            }
        }

        function setExecutorMarker(request) {
            if (!request.executor || !request.executor.details ||
                request.status !== vm.requestStatus.IN_PROGRESS || vm.isSpecialistHidden) {

                return;
            }

            vm.specialists = [request.executor];
            setMapCenter(request.executor.details.latitude, request.executor.details.longitude);
        }

        function listenLocationEvent() {
            if (vm.currentRequest.status !== vm.requestStatus.IN_PROGRESS || vm.isSpecialistHidden) {

                return;
            }

            console.log('onLocation');
            return customerDataservice.onLocation(function (location, type) {
                if (type !== 'update') {

                    return;
                }

                vm.specialists[0].details.latitude = location.latitude;
                vm.specialists[0].details.longitude = location.longitude;

                setMapCenter(location.latitude, location.longitude);
            });
        }

        function showSpecialistInfo(marker, eventName, model) {
            if (!vm.showSpecialistInfo) {

                return;
            }

            vm.showSpecialistInfo({marker: marker, eventName: eventName, model: model});
        }

        function getBoundsOfDistance(request) {
            if (!request.location || !request.distance) {

                return;
            }

            vm.boundsOfDistance = geocoderService.getBoundsOfDistance(
                request.location.latitude,
                request.location.longitude,
                request.distance
            );
        }

        function activate() {
            initializeMap();
            uiGmapIsReady.promise(1)
                .then(function () {
                    locationHandler = listenLocationEvent();

                    setRequestMarker(vm.currentRequest);
                    setExecutorMarker(vm.currentRequest);

                    getBoundsOfDistance(vm.currentRequest);

                    $scope.$watch('vm.currentRequest.status', function (newRequestStatus, oldRequestStatus) {
                        if (newRequestStatus === oldRequestStatus ||
                            vm.currentRequest.status !== vm.requestStatus.IN_PROGRESS) {

                            return;
                        }

                        delete vm.map.specialistMarker.options.animation;

                        setExecutorMarker(newRequestStatus);
                    });
                });

            $scope.$on('$destroy', function () {
                if (locationHandler) {
                    customerDataservice.offLocation(locationHandler);
                }
            });
        }
    }
})();