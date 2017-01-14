(function () {
    'use strict';

    angular
        .module('app.provider')
        .factory('specialistGeoService', specialistGeoService);

    specialistGeoService.$inject = [
        '$q',
        'coreConstants',
        'currentUserService',
        'geocoderService'
    ];

    /* @ngInject */
    function specialistGeoService($q, coreConstants, currentUserService, geocoderService) {
        var service = {
            startGeoTracking: startGeoTracking
        };

        return service;

        function startGeoTracking(currentUserType) {

            return getCurrentUserType(currentUserType)
                .then(function (currentUserType) {
                    geocoderService.stopGeoTracking();

                    if (currentUserType !== coreConstants.USER_TYPES.SPECIALIST) {

                        return $q.reject();
                    }

                    return geocoderService.startGeoTracking();
                });
        }

        function getCurrentUserType(currentUserType) {

            return $q.when(currentUserType || currentUserService.getType());
        }
    }
})();