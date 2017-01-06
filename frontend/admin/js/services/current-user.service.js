(function () {
    'use strict';

    angular
        .module('app')
        .factory('currentUserService', currentUserService);

    currentUserService.$inject = ['$q', 'adminDataService', 'localService'];

    /* @ngInject */
    function currentUserService($q, adminDataService, localService) {
        var service = {
            getUser: getUser,
            isAdmin: isAdmin
        };

        return service;

        function getUser() {
            if (!isAuthenticated()) {

                return $q.reject(new Error('You are not logged.'));
            }

            return $q.when(getUserFromLocalStorage() || getUserFromHttp());
        }

        function getUserFromLocalStorage() {

            return localService.getUser();
        }

        function getUserFromHttp() {

            return adminDataService.getCurrentUser()
                .then(getUserFromHttpComplete);
        }

        function getUserFromHttpComplete(user) {

            return user;
        }

        function isAdmin() {

            return getUser()
                .then(function (currentUser) {

                    return !!currentUser.isAdmin;
                });
        }

        function isAuthenticated() {

            return localService.getAuth();
        }
    }
})();