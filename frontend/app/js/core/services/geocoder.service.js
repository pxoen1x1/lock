(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('geocoderService', geocoderService);

    geocoderService.$inject = ['$q', '$window'];

    function geocoderService($q, $window) {

        return {
            getCurrentCoordinates: getCurrentCoordinates,
            getCoordinates: getCoordinates,
            getLocation: getLocation
        };

        function getCurrentCoordinates() {

            return $q(function (resolve, reject) {
                if (!$window.navigator && !$window.navigator.geolocation) {

                    return reject('Your browser doesn\'t support geolocation.');
                }

                $window.navigator.geolocation.getCurrentPosition(
                    function (position) {
                        resolve(position.coords);
                    },
                    function (error) {
                        reject('Geolocation service failed for the following reason: ' + error.message);
                    });
            });
        }

        function getCoordinates(address) {

            return $q(function (resolve, reject) {
                if (!$window.google || !$window.google.maps) {

                    return reject('The Maps JavaScript API was not loaded');
                }

                var geocoder = new $window.google.maps.Geocoder();

                geocoder.geocode(
                    {'address': address},
                    function (results, status) {
                        if (status !== $window.google.maps.GeocoderStatus.OK) {

                            return reject('Geocode was not successful for the following reason: ' + status);
                        }

                        resolve(results[0].geometry.location);
                    });
            });
        }

        function getLocation(lat, lng) {

            return $q(function (resolve, reject) {
                if (!$window.google || !$window.google.maps) {

                    return reject('The Maps JavaScript API was not loaded');
                }

                var geocoder = new $window.google.maps.Geocoder();

                geocoder.geocode(
                    {'location': {lat: lat, lng: lng}},
                    function (results, status) {
                        if (status !== $window.google.maps.GeocoderStatus.OK) {

                            return reject('Geocoder failed due to: ' + status);
                        }

                        if (!results[1]) {

                            return reject('No results found');
                        }

                        resolve(results[1].formatted_address); // jshint ignore:line
                    });
            });
        }
    }
})();
