(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('distance', distance);

    distance.$inject = ['geocoderService'];

    function distance(geocoderService) {
        var currentPosition = null;
        var serviceInvoked = false;

        function distanceSyncFilter(location) {
            var distance = geocoderService.getDistance(
                currentPosition.latitude, currentPosition.longitude,
                location.latitude, location.longitude
            );

            return distance.toFixed(2);
        }

        return distanceFilter;

        function distanceFilter(location) {
            if (currentPosition === null) {
                if (!serviceInvoked) {
                    serviceInvoked = true;

                    geocoderService.getCurrentCoordinates()
                        .then(function (position) {
                            currentPosition = position;
                        });
                }

                return ' ';
            }

            return distanceSyncFilter(location);
        }
    }
})();