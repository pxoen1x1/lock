(function () {
    'use strict';

    angular
        .module('app.customer')
        .factory('customerDataservice', customerDataservice);

    customerDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function customerDataservice($http, request, conf) {
        var service = {
            getAllRequests: getAllRequests,
            getRequest: getRequest,
            createRequest: createRequest
        };

        return service;

        function getAllRequests(params) {

            return request.httpWithTimeout({
                url: conf.URL + 'client/requests',
                method: 'GET',
                params: params
            });
        }

        function getRequest(selectedRequest) {

            return request.httpWithTimeout({
                url: conf.URL + 'client/requests/' + selectedRequest.id,
                method: 'GET'
            });
        }

        function createRequest(newRequest) {

            return $http({
                url: conf.URL + 'client/request',
                method: 'POST',
                data: newRequest
            })
                .then(createRequestCompleted);

            function createRequestCompleted(response) {

                return response.data;
            }

        }
    }
})();