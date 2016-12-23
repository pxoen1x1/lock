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
            getChatByRequest: getChatByRequest,
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

        function getChatByRequest(currentRequest) {
            var url = conf.BASE_URL + conf.URL_PREFIX + 'specialist/requests/' + currentRequest.id + '/chat';

            return $sails.get(url)
                .then(getChatByRequestComplete);

            function getChatByRequestComplete(response) {

                return response.data.chat;
            }
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