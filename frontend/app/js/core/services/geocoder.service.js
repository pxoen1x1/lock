(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('geocoderService', geocoderService);

    geocoderService.$inject = ['$q', '$window', 'uiGmapGoogleMapApi'];

    function geocoderService($q, $window, uiGmapGoogleMapApi) {

        var service = {
            getCurrentCoordinates: getCurrentCoordinates,
            getCoordinates: getCoordinates,
            getLocation: getLocation
        };

        return service;

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
            var deferred = $q.defer();

            uiGmapGoogleMapApi.then(function (googleMaps) {
                var geocoder = new googleMaps.Geocoder();

                geocoder.geocode(
                    {'address': address},
                    function (results, status) {
                        if (status === googleMaps.GeocoderStatus.ZERO_RESULTS) {

                            return deferred.reject('Address isn\'t found');
                        }

                        if (status !== googleMaps.GeocoderStatus.OK) {

                            return deferred.reject('Geocode was not successful for the following reason: ' + status);
                        }

                        deferred.resolve(results[0].geometry.location);
                    });
            });

            return deferred.promise;
        }

        function getLocation(lat, lng) {
            var deferred = $q.defer();

            uiGmapGoogleMapApi.then(function (googleMaps) {
                var geocoder = new googleMaps.Geocoder();

                geocoder.geocode(
                    {'location': {lat: lat, lng: lng}},
                    function (results, status) {
                        if (status !== googleMaps.GeocoderStatus.OK) {

                            return deferred.reject('Geocoder failed due to: ' + status);
                        }

                        if (!results[1]) {

                            return deferred.reject('No results found');
                        }

                        deferred.resolve(results[1].formatted_address); // jshint ignore:line
                    });
            });

            return deferred.promise;
        }
    }
})();
