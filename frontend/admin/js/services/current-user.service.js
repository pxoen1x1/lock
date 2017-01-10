(function () {
    'use strict';

    angular
        .module('app')
        .factory('currentUserService', currentUserService);

    currentUserService.$inject = ['adminDataService', 'localService', 'errorService'];

    /* @ngInject */
    function currentUserService(adminDataService, localService, errorService) {
        var service = {
            getUser: getUser,
            isAdmin: isAdmin
        };

        return service;

        function getUser() {
            if (!isAuthenticated()) {
                var error = new errorService.CustomError();
                error.message = 'You are not logged.';
                error.isShown = true;

                return error.reject();
            }

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