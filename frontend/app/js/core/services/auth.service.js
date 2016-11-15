(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('authService', authService);

    authService.$inject = ['coreDataservice', 'socketService', 'localService', 'currentUserService'];

    /* @ngInject */
    function authService(coreDataservice, socketService, localService, currentUserService) {
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

            return localService.getAuth() ? true : false;
        }

        function login(user) {

            return coreDataservice.login(user)
                .then(function (auth) {
                    clearData();
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
                    clearData();

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
                .then(function () {

                    return socketService.subscribe();
                });
        }

        function clearData() {
            currentUserService.clearType();
            localService.clear();
        }
    }
})();