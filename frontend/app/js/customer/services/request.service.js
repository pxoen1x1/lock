(function () {
    'use strict';

    angular
        .module('app.customer')
        .factory('requestService', requestService);

    requestService.$inject = ['$q', 'customerDataservice'];

    /* @ngInject */
    function requestService($q, customerDataservice) {
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

            getRequestFromHttpPromise = customerDataservice.getRequest(currentRequest);

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