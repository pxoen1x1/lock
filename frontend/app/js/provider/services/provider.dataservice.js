(function () {
    'use strict';

    angular
        .module('app.provider')
        .factory('serviceProviderDataservice', serviceProviderDataservice);

    serviceProviderDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function serviceProviderDataservice($http, request, conf) {
        var service = {
            getAllRequests: getAllRequests,
            getUser: getUser,
            updateUser: updateUser
        };

        return service;

        function getAllRequests(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'specialist/requests',
                method: 'GET',
                params: params
            });
        }

        function getUser() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'user',
                method: 'GET'
            });
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