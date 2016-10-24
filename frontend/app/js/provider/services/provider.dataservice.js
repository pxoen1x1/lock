(function () {
    'use strict';

    angular
        .module('app.provider')
        .factory('serviceProviderDataservice', serviceProviderDataservice);

    serviceProviderDataservice.$inject = ['$http', '$sails', 'request', 'conf'];

    /* @ngInject */
    function serviceProviderDataservice($http, $sails, request, conf) {
        var service = {
            getRequests: getRequests,
            getRequest: getRequest,
            checkRequestsStatus: checkRequestsStatus,
            updateLocation: updateLocation
        };

        return service;

        function getRequests(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'specialist/requests',
                method: 'GET',
                params: params
            });
        }

        function getRequest(currentRequest) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'specialist/requests/' + currentRequest.id,
                method: 'GET'
            });
        }

        function checkRequestsStatus(status) {

            return $sails.get(conf.URL_PREFIX + 'specialist/requests/status/check', status)
                .then(checkRequestsStatusCompleted);

            function checkRequestsStatusCompleted(response) {

                return response.data.count;
            }
        }

        function updateLocation(location) {

            return $sails.put(conf.URL_PREFIX + 'specialist/location', location)
                .then(updateLocationCompleted);

            function updateLocationCompleted(response) {

                return response.data.location;
            }
        }
    }
})();