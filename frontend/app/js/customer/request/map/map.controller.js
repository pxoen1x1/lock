(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestMapController', CustomerRequestMapController);

    CustomerRequestMapController.$inject = ['$scope', '$state', 'uiGmapIsReady'];

    /* @ngInject */
    function CustomerRequestMapController($scope, $state, uiGmapIsReady) {
        var vm = this;

        uiGmapIsReady.promise()
            .then(function (instances) {
                vm.map.inst = instances[0].map;
            });

        vm.map = {
            inst: '',
            center: {
                latitude: 51.219053,
                longitude: 4.404418
            },
            zoom: 14,
            options: {
                scrollwheel: false,
                streetViewControl: false
            }
        };

        vm.markers = [
            {
                id: 1,
                type: 'order',
                latitude: vm.map.center.latitude,
                longitude: vm.map.center.longitude,
                title: 'You',
                events: '',
                options: ''
            }
        ];


        vm.getCurrentLocation = function () {
            var options = {
                enableHighAccuracy: true
            };
            navigator.geolocation.getCurrentPosition(
                function (pos) {
                    vm.map.center = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    };

                    // user marker
                    vm.markers[0].latitude = pos.coords.latitude;
                    vm.markers[0].longitude = pos.coords.longitude;

                    $scope.$apply();
                },
                function (error) {
                    console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
                },
                options
            );
        }
    }
})();