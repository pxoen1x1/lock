(function () {
    'use strict';

    angular
        .module('app.provider')
        .factory('requestService', requestService);

    requestService.$inject = ['$q', 'serviceProviderDataservice'];

    /* @ngInject */
    function requestService($q, serviceProviderDataservice) {
        var getRequestFromHttpPromise;
        var request;

        var service = {
            getRequest: getRequest,
            setRequest: setRequest
        };
        return service;

        function getRequest(requestId) {
            if (!requestId) {

                return $q.resolve(request);
            }

            var currentRequest = {
                id: requestId
            };

            return $q.when(request || getRequestFromHttp(currentRequest));
        }

        function setRequest(newRequest) {
            request = newRequest;
        }

        function getRequestFromHttp(currentRequest) {
            if (getRequestFromHttpPromise) {

                getRequestFromHttpPromise.cancel();
            }

            getRequestFromHttpPromise = serviceProviderDataservice.getRequest(currentRequest);

            return getRequestFromHttpPromise
                .then(getRequestFromHttpComplete)
                .catch(getRequestFromHttpFailed);
        }

        function getRequestFromHttpComplete(response) {
            request = response.data.request;

            return request;
        }

        function getRequestFromHttpFailed(error) {

            return error;
        }
    }
})();