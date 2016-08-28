(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('geocoderService', geocoderService);

    geocoderService.$inject = ['$q', '$window', 'uiGmapGoogleMapApi', 'coreConstants'];

    function geocoderService($q, $window, uiGmapGoogleMapApi, coreConstants) {

        var service = {
            getCurrentCoordinates: getCurrentCoordinates,
            getCoordinates: getCoordinates,
            getLocation: getLocation,
            getBoundsOfDistance: getBoundsOfDistance,
            getDistance: getDistance
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

                        if (!results[0]) {

                            return deferred.reject('No results found');
                        }

                        deferred.resolve(results[0].formatted_address); // jshint ignore:line
                    });
            });

            return deferred.promise;
        }

        function getBoundsOfDistance(latitude, longitude, distance) {
            var bounds = {};
            bounds.northEast = {};
            bounds.southWest = {};

            var radLat = convertToRadian(latitude);
            var radLon = convertToRadian(longitude);
            var radius = coreConstants.DISTANCE.earthRadius * coreConstants.DISTANCE.toMile;

            var radDist = distance / radius;
            var minLat = radLat - radDist;
            var maxLat = radLat + radDist;

            var MAX_LAT_RAD = convertToRadian(90);
            var MIN_LAT_RAD = convertToRadian(-90);
            var MAX_LON_RAD = convertToRadian(180);
            var MIN_LON_RAD = convertToRadian(-180);

            var PI_X2 = Math.PI * 2;

            var minLon;
            var maxLon;

            if (minLat > MIN_LAT_RAD && maxLat < MAX_LAT_RAD) {
                var deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
                minLon = radLon - deltaLon;

                if (minLon < MIN_LON_RAD) {
                    minLon += PI_X2;
                }

                maxLon = radLon + deltaLon;

                if (maxLon > MAX_LON_RAD) {
                    maxLon -= PI_X2;
                }

            } else {
                // A pole is within the distance.
                minLat = Math.max(minLat, MIN_LAT_RAD);
                maxLat = Math.min(maxLat, MAX_LAT_RAD);
                minLon = MIN_LON_RAD;
                maxLon = MAX_LON_RAD;
            }

            bounds.southWest.latitude = convertToDeg(minLat);
            bounds.southWest.longitude = convertToDeg(minLon);
            bounds.northEast.latitude = convertToDeg(maxLat);
            bounds.northEast.longitude = convertToDeg(maxLon);

            return bounds;
        }

        function getDistance(latitude1, longitude1, latitude2, longitude2) {
            var radius = coreConstants.DISTANCE.earthRadius * coreConstants.DISTANCE.toMile;

            var radLat1 = convertToRadian(latitude1);
            var radLat2 = convertToRadian(latitude2);
            var dLat = radLat2 - radLat1;
            var dLon = convertToRadian(longitude2 - longitude1);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(radLat1) * Math.cos(radLat2) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            var distance = radius * c;

            return distance;
        }

        function convertToRadian(deg) {

            return deg * Math.PI / 180;
        }

        function convertToDeg(rad) {
            return rad * 180 / Math.PI;
        }
    }
})();
