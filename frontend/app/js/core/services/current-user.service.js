(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('currentUserService', currentUserService);

    currentUserService.$inject = ['$q', 'coreDataservice', 'authService', 'localService', 'coreConstants'];

    /* @ngInject */
    function currentUserService($q, coreDataservice, authService, localService, coreConstants) {
        var getUserPromise;
        var userType;

        var service = {
            getUser: getUser,
            setUser: setUser,
            getType: getType
        };

        return service;

        function getUser() {
            if(!authService.isAuthenticated()) {

                return $q.reject(new Error('You are not logged.'));
            }

            return $q.when(getUserFromLocalStorage() || getUserFromHttp());
        }

        function getUserFromLocalStorage() {

            return localService.getUser();
        }

        function getUserFromHttp() {
            if (getUserPromise) {
                getUserPromise.cancel();
            }

            getUserPromise = coreDataservice.getCurrentUser();

            return getUserPromise
                .then(getUserFromHttpComplete)
                .catch(getUserFromHttpFailed);
        }

        function getUserFromHttpComplete(response) {

            var currentUser = response.data.user;

            localService.setUser(currentUser);

            return currentUser;
        }

        function getUserFromHttpFailed(error) {

            return error;
        }

        function setUser(user) {

            return setUserToHttp(user)
                .then(function (currentUser) {

                    localService.setUser(currentUser);
                    setCurrentUserType(currentUser);

                    return currentUser;
                });
        }

        function setUserToHttp(user) {

            return coreDataservice.updateUser(user)
                .then(setUserToHttpComplete)
                .catch(setUserToHttpFailed);
        }

        function setUserToHttpComplete(response) {

            return response.data.user;
        }

        function setUserToHttpFailed(error) {

            return error;
        }

        function getType() {
            if(!authService.isAuthenticated()) {

                return $q.reject(new Error('You are not logged.'));
            }

            return $q.when(userType || getCurrentUserType());
        }

        function getCurrentUserType() {

            return getUser()
                .then(setCurrentUserType);
        }

        function setCurrentUserType(currentUser) {
            if (currentUser.details && currentUser.details.id) {
                userType = coreConstants.USER_TYPES.SPECIALIST;
            } else {
                userType = coreConstants.USER_TYPES.CLIENT;
            }

            return userType;
        }
    }
})();