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
                selectedRequest: '=',
                fullscreenDisabled: '='
            },
            templateUrl: 'core/directives/map-viewer/map-viewer.html',
            replace: true
        };

        return directive;

        function link(scope, element, attrs) {
            var isFullScreenMode = false;

            var vm = scope.vm;

            var fullScreenModeDisabled = attrs.fullscreenDisabled && attrs.fullscreenDisabled !== 'false';

            vm.toggleFullScreenMode = toggleFullScreenMode;

            function toggleFullScreenMode() {
                if (fullScreenModeDisabled) {

                    return;
                }

                isFullScreenMode = !isFullScreenMode;
                var sideBar = angular.element(document.querySelector('md-sidenav.menu'));
                var headerToolbar = angular.element(document.querySelector('.header md-toolbar'));

                if (isFullScreenMode) {
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
        }
    }

    MapViewerController.$inject = ['$scope', 'uiGmapIsReady', 'coreConstants'];

    /* @ngInject */
    function MapViewerController($scope, uiGmapIsReady, coreConstants) {
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
                disableDoubleClickZoom: true,
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
                title: vm.selectedRequest.location.address
            }
        };

        activate();

        vm.refreshMap = refreshMap;

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

