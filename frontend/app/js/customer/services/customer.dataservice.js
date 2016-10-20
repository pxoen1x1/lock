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
            getSpecialists: getSpecialists,
            createRequest: createRequest,
            createFeedback: createFeedback,
            updateUser: updateUser
        };

        return service;

        function getAllRequests(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'client/requests',
                method: 'GET',
                params: params
            });
        }

        function getSpecialists(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'specialists/find',
                method: 'GET',
                params: params
            });
        }

        function createRequest(newRequest) {

            return $http({
                url: conf.BASE_URL + conf.URL_PREFIX + 'client/requests',
                method: 'POST',
                data: newRequest
            })
                .then(createRequestCompleted);

            function createRequestCompleted(response) {

                return response.data;
            }

        }

        function createFeedback(newFeedback) {

            return $http({
                url: conf.BASE_URL + conf.URL_PREFIX + 'client/requests/' + newFeedback.requestId + '/feedback',
                method: 'POST',
                data: newFeedback
            })
                .then(createFeedbackCompleted);

            function createFeedbackCompleted(response) {

                return response.data;
            }

        }

        function updateUser(updatedUser) {

            return $http({
                url: conf.BASE_URL + conf.URL_PREFIX + 'user/' + updatedUser.id,
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