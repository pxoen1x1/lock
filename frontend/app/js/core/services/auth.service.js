(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('authService', authService);

    authService.$inject = ['coreDataservice', 'socketService', 'localService'];

    /* @ngInject */
    function authService(coreDataservice, socketService, localService) {
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

                        return socketService.subscribe();
                    }
                );
        }

        function logout() {

            return coreDataservice.logout()
                .then(function () {

                    return localService.clear();
                })
                .then(function() {

                    return socketService.unsubscribe();
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

                    return socketService.subscribe();
                });
        }
    }
})();