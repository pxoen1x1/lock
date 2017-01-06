(function () {
    'use strict';

    angular
        .module('app')
        .factory('authService', authService);

    authService.$inject = ['adminDataService', 'socketService', 'localService', 'currentUserService'];

    /* @ngInject */
    function authService(adminDataService, socketService, localService, currentUserService) {
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

            return !!localService.getAuth();
        }

        function login(user) {

            return adminDataService.login(user)
                .then(function (auth) {
                    clearData();
                    localService.setAuth(auth);

                    return currentUserService.getUser();
                })
                .then(function (currentUser) {
                    if (currentUser) {
                        localService.setUser(currentUser);
                        localService.setLanguage(currentUser.usingLanguage);
                    }

                    return socketService.subscribe();
                });
        }

        function logout() {

            return adminDataService.logout()
                .then(function () {

                    return socketService.unsubscribe();
                })
                .then(clearData);
        }

        function clearData() {
            localService.removeAuth();
            localService.removeUser();
        }
    }
})();