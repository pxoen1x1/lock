(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('currentUserService', currentUserService);

    currentUserService.$inject = ['$q', 'coreDataservice', 'localService', 'coreConstants'];

    /* @ngInject */
    function currentUserService($q, coreDataservice, localService, coreConstants) {
        var currUser = {'userProfile': ''};
        var userType;

        var service = {
            currUser: currUser,
            getUser: getUser,
            setUserToLocalStorage: setUserToLocalStorage,
            setUser: setUser,
            getType: getType,
            clearType: clearType,
            isAuthenticated: isAuthenticated
        };

        return service;

        function getUser() {
            if (!isAuthenticated()) {

                return $q.reject(new Error('You are not logged.'));
            }

            return $q.when(getUserFromLocalStorage() || getUserFromHttp())
                .then(function(currentUser) {

                    currUser.userProfile = currentUser;

                    return currentUser;
                });
        }

        function getUserFromLocalStorage() {

            return localService.getUser();
        }

        function setUserToLocalStorage(currentUser) {

            return localService.setUser(currentUser);
        }

        function getUserFromHttp() {

            return coreDataservice.getCurrentUser();
        }

        function setUser(user) {

            return setUserToHttp(user)
                .then(function (currentUser) {

                    localService.setUser(currentUser);
                    setCurrentUserType(currentUser);

                    currUser.userProfile = currentUser;

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

            return angular.isObject(localService.getAuth());
        }
    }
})();