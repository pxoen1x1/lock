(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('currentUserService', currentUserService);

    currentUserService.$inject = ['$q', 'coreDataservice', 'localService', 'coreConstants'];

    /* @ngInject */
    function currentUserService($q, coreDataservice, localService, coreConstants) {
        var getUserPromise;
        var getUserPaymentPromise;
        var userType;

        var service = {
            getUser: getUser,
            setUserToLocalStorage: setUserToLocalStorage,
            setUser: setUser,
            getType: getType,
            clearType: clearType
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

        function setUserToLocalStorage(currentUser) {

            return localService.setUser(currentUser);
        }

        function getUserFromHttp() {
            if (getUserPromise) {
                getUserPromise.cancel();
            }

            getUserPromise = coreDataservice.getCurrentUser();

            return getUserPromise
                .then(getUserFromHttpComplete);
        }

        function getUserFromHttpComplete(response) {

            return response.data.user;
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
            if (!isAuthenticated()) {

                return $q.reject(new Error('You are not logged.'));
            }

            return $q.when(userType || getCurrentUserType());
        }

        function getCurrentUserType() {

            return getUser()
                .then(setCurrentUserType);
        }

        function setCurrentUserType(currentUser) {
            if (currentUser.isAdmin) {
                userType = coreConstants.USER_TYPES.ADMIN;
            } else if (currentUser.groups && currentUser.groups.length > 0) {
                userType = coreConstants.USER_TYPES.GROUP_ADMIN;
            } else if (currentUser.details && currentUser.details.id) {
                userType = coreConstants.USER_TYPES.SPECIALIST;
            } else {
                userType = coreConstants.USER_TYPES.CLIENT;
            }

            return userType;
        }

        function clearType() {
            userType = null;
        }

        function isAuthenticated() {

            return localService.getAuth();
        }
    }
})();