(function () {
    'use strict';

    angular
        .module('app.customer')
        .factory('customerDataservice', customerDataservice);

    customerDataservice.$inject = ['$http', 'request', 'conf', 'socketService'];

    /* @ngInject */
    function customerDataservice($http, request, conf, socketService) {
        var service = {
            getAllRequests: getAllRequests,
            getSpecialists: getSpecialists,
            getRequestFeedback: getRequestFeedback,
            createRequest: createRequest,
            createFeedback: createFeedback,
            updateUser: updateUser,
            onLocation: onLocation,
            offLocation: offLocation
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

        function getRequestFeedback(requestId) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'client/requests/' + requestId + '/feedback',
                method: 'GET'
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

        function onLocation(next) {
            return socketService.listener('location', function (event) {
                next(event.location, event.type);
            });
        }

        function offLocation(handler) {
            socketService.stopListener('location', handler);
        }
    }
})();