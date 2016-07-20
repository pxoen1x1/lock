(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('coreDataservice', coreDataservice);

    coreDataservice.$inject = ['$http', 'conf'];

    /* @ngInject */
    function coreDataservice($http, conf) {
        var service = {
            createUser: createUser
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
    }
})();