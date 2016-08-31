(function () {
    'use strict';

    angular
        .module('app.provider')
        .factory('serviceProviderDataservice', serviceProviderDataservice);

    serviceProviderDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function serviceProviderDataservice($http, request, conf) {
        var service = {
            getUser: getUser,
            updateUser: updateUser
        };

        return service;

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