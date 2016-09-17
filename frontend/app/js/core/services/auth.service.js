(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('authService', authService);

    authService.$inject = ['coreDataservice', 'coreSocketDataservice', 'localService'];

    /* @ngInject */
    function authService(coreDataservice, coreSocketDataservice, localService) {
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

            return localService.getAuth();
        }

        function login(user) {

            return coreDataservice.login(user)
                .then(function (auth) {
                    localService.clear();
                    localService.setAuth(auth);

                    return auth;
                })
                .then(function () {

                        return coreSocketDataservice.subscribeSocket();
                    }
                );
        }

        function logout() {

            return coreDataservice.logout()
                .then(function () {

                    return localService.clear();
                })
                .then(function() {

                    return coreSocketDataservice.unsubscribeSocket();
                });
        }

        function register(user) {

            return coreDataservice.createUser(user)
                .then(function (auth) {
                    localService.clear();

                    localService.setAuth(auth);

                    return auth;
                })
                .then(function() {

                    return coreSocketDataservice.subscribeSocket();
                });
        }
    }
})();