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
            logout: logout,
            register: register
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
                    localService.set('auth', JSON.stringify(auth));

                    return auth;
                });
        }

        function logout() {

            return coreDataservice.logout()
                .then(function () {

                    return localService.clear();
                });
        }

        function register(user) {

            return coreDataservice.createUser(user)
                .then(function (auth) {
                    localService.clear();

                    localService.set('auth', JSON.stringify(auth));
                });
        }
    }
})();