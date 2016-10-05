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
            getSpecialists: getSpecialists,
            createRequest: createRequest,
            updateUser: updateUser
        };

        return service;

        function getAllRequests(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + '/api/client/requests',
                method: 'GET',
                params: params
            });
        }

        function getRequest(currentRequest) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + '/api/client/requests/' + currentRequest.id,
                method: 'GET'
            });
        }

        function getSpecialists(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + '/api/specialists/find',
                method: 'GET',
                params: params
            });
        }

        function createRequest(newRequest) {

            return $http({
                url: conf.BASE_URL + '/api/client/requests',
                method: 'POST',
                data: newRequest
            })
                .then(createRequestCompleted);

            function createRequestCompleted(response) {

                return response.data;
            }

        }

        function updateUser(updatedUser) {

            return $http({
                url: conf.BASE_URL + '/api/user/' + updatedUser.id,
                method: 'PUT',
                data: updatedUser
            })
                .then(updateUserCompleted);

            function updateUserCompleted(response) {

                return response;
            }
        }
    }
})();