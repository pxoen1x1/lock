(function () {
    'use strict';

    angular
        .module('app.group')
        .factory('groupDataservice', groupDataservice);

    groupDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function groupDataservice($http, request, conf) {
        var service = {
            getUser: getUser,
            updateUser: updateUser
        };

        return service;

        function getUser() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + '/api/user',
                method: 'GET'
            });
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