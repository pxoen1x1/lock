(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('coreDataservice', coreDataservice);

    coreDataservice.$inject = ['$http', 'conf'];

    /* @ngInject */
    function coreDataservice($http, conf) {
        var service = {
            createUser: createUser,
            updateUser: updateUser
        };

        return service;

        function createUser(newUser) {

            return $http({
                url: conf.URL + 'user',
                method: 'POST',
                data: newUser
            })
                .then(createUserComplete);

            function createUserComplete(response) {

                return response.data;
            }
        }

        function updateUser(user) {

            return $http({
                url: conf.URL + 'user/' + user.id,
                method: 'PUT',
                data: user
            })
                .then(updateUserComplete);

            function updateUserComplete(response) {

                return response.data;
            }
        }
    }
})();