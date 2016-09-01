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

            var selectedRequest = {
                id: requestId
            };

            return $q.when(request || getRequestFromHttp(selectedRequest));
        }

        function setRequest(newRequest) {
            request = newRequest;
        }

        function getRequestFromHttp(selectedRequest) {
            if (getRequestFromHttpPromise) {

                getRequestFromHttpPromise.cancel();
            }

            getRequestFromHttpPromise = customerDataservice.getRequest(selectedRequest);

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