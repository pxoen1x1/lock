(function () {
    'use strict';

    angular
        .module('app')
        .factory('authService', authService);

    authService.$inject = ['adminDataService', 'socketService', 'localService', 'currentUserService', 'errorService'];

    /* @ngInject */
    function authService(adminDataService, socketService, localService, currentUserService, errorService) {
        var service = {
            authorize: authorize,
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout
        };
        return service;

        function authorize(isPublicPage) {

            if (isPublicPage) {

                return true;
            }

            return isAuthenticated();
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
                    if (!currentUser.isAdmin) {

                        return logout()
                            .then(function () {
                                var error = new errorService.CustomError();
                                error.message = 'Please, sign in as administrator.';
                                error.isShown = true;

                                return error.reject();
                            });
                    }

                    return currentUser;
                })
                .then(function (currentUser) {
                    if (currentUser) {
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
        }
    }
})();