(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('authService', authService);

    authService.$inject = [
        'coreDataservice',
        'socketService',
        'localService',
        'currentUserService',
        'geocoderService'
    ];

    /* @ngInject */
    function authService(coreDataservice, socketService, localService, currentUserService, geocoderService) {
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

            return !!localService.getAuth();
        }

        function login(user) {

            return coreDataservice.login(user)
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

            return coreDataservice.logout()
                .then(function () {

                    return socketService.unsubscribe();
                })
                .then(function(){
                    clearData();

                    geocoderService.stopGeoTracking();
                });
        }

        function register(user) {

            return coreDataservice.createUser(user)
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

        function clearData() {
            currentUserService.clearType();
            localService.removeAuth();
            localService.removeUser();
        }
    }
})();