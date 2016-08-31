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
            getUser: getUser,
            updateUser: updateUser
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

        function getSpecialists(params) {

            return request.httpWithTimeout({
                url: conf.URL + 'specialists/find',
                method: 'GET',
                params: params
            });
        }

        function createRequest(newRequest) {

            return $http({
                url: conf.URL + 'client/requests',
                method: 'POST',
                data: newRequest
            })
                .then(createRequestCompleted);

            function createRequestCompleted(response) {

                return response.data;
            }

        }

        function getUser() {

            return request.httpWithTimeout({
                url: conf.URL + 'user',
                method: 'GET'
            });
        }

        function updateUser(updatedUser) {

            return $http({
                url: conf.URL + 'user/' + updatedUser.id,
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