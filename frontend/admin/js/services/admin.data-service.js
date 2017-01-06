(function () {
    'use strict';

    angular
        .module('app')
        .factory('adminDataService', adminDataService);

    adminDataService.$inject = ['$sails', 'conf'];

    /* @ngInject */
    function adminDataService($sails, conf) {
        var service = {
            getCurrentUser: getCurrentUser,
            login: login,
            logout: logout
        };

        return service;

        function getCurrentUser() {

            return $sails.get(conf.URL_PREFIX + 'user')
                .then(getCurrentUserComplete);

            function getCurrentUserComplete(response) {

                return response.data.user;
            }
        }

        function login(user, type) {
            var loginType = type || 'local';

            return $sails.post('/auth/login?type=' + loginType, user)
                .then(loginComplete);

            function loginComplete(response) {

                return response.data;
            }
        }

        function logout() {

            return $sails.post('/auth/logout')
                .then(logoutComplete);

            function logoutComplete(response) {

                return response.data;
            }
        }
    }
})();