(function () {
    'use strict';

    angular
        .module('app.provider')
        .factory('specialistGeoService', specialistGeoService);

    specialistGeoService.$inject = [
        '$q',
        'coreConstants',
        'currentUserService',
        'serviceProviderDataservice',
        'geocoderService'
    ];

    /* @ngInject */
    function specialistGeoService($q, coreConstants, currentUserService, serviceProviderDataservice, geocoderService) {
        var service = {
            startGeoTracking: startGeoTracking
        };

        return service;

        function startGeoTracking(currentUserType) {

            return getCurrentUserType(currentUserType)
                .then(function (currentUserType) {

                    return checkRequestsStatus(currentUserType);
                })
                .then(function (requestCount) {
                    geocoderService.stopGeoTracking();

                    if (!requestCount) {

                        return;
                    }

                    return geocoderService.startGeoTracking();
                });
        }

        function getCurrentUserType(currentUserType) {

            return $q.when(currentUserType || currentUserService.getType());
        }

        function checkRequestsStatus(currentUserType) {
            if (currentUserType !== coreConstants.USER_TYPES.SPECIALIST) {

                return;
            }

            var status = {
                status: coreConstants.REQUEST_STATUSES.IN_PROGRESS
            };

            return serviceProviderDataservice.checkRequestsStatus(status);
        }
    }
})();