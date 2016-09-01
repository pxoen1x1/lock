(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('authService', authService);

    authService.$inject = ['coreDataservice', 'localService'];

    /* @ngInject */
    function authService(coreDataservice, localService) {
        var service = {
            authorize: authorize,
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout
        };
        return service;

        function authorize(access) {
            if (access) {

                return isAuthenticated();
            }

            return true;
        }

        function isAuthenticated() {

            return localService.get('auth');
        }

        function login(user) {

            return coreDataservice.login(user)
                .then(function (auth) {
                    localService.set('auth', auth);

                    return auth;
                });
        }

        function logout() {

            return coreDataservice.logout()
                .then(function () {

                    return localService.clear();
                });
        }
    }
})();