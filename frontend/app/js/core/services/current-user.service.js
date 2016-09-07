(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('currentUserService', currentUserService);

    currentUserService.$inject = ['$q', 'coreDataservice', 'localService'];

    /* @ngInject */
    function currentUserService($q, coreDataservice, localService) {
        var getUserPromise;
        var setUserPromise;

        var service = {
            getUser: getUser,
            setUser: setUser
        };

        return service;

        function getUser() {

            return $q.when(getUserFromLocalStorage() || getUserFromHttp());
        }

        function getUserFromLocalStorage() {
            var user = localService.getUser();

            return user;
        }

        function getUserFromHttp() {
            if (getUserPromise) {
                getUserPromise.cancel();
            }

            getUserPromise = coreDataservice.getUser();

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

            return $q.when(setUserToHttp(user));
        }

        function setUserToHttp(user) {
            if (setUserPromise) {
                setUserPromise.cancel();
            }

            setUserPromise = coreDataservice.updateUser(user);

            return setUserPromise
                .then(setUserToHttpComplete)
                .catch(setUserToHttpFailed);
        }

        function setUserToHttpComplete(response) {

            var currentUser = response.data.user;

            localService.setUser(currentUser);

            return currentUser;
        }

        function setUserToHttpFailed(error) {

            return error;
        }
    }
})();