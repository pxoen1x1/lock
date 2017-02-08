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
        'geocoderService',
        'mobileService'
    ];

    /* @ngInject */
    function authService(coreDataservice, socketService, localService, currentUserService, geocoderService,
                         mobileService) {
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
            var device = localService.getDeviceInfo();

            var params = {};

            if (device && device.uuid) {
                params.uuid = device.uuid;
            }

            return coreDataservice.logout(params)
                .then(function () {
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
                })
                .then(function () {

                    return mobileService.saveDeviceInfo();
                });
        }

        function clearData() {
            currentUserService.clearType();
            localService.removeAuth();
            localService.removeUser();
        }
    }
})();