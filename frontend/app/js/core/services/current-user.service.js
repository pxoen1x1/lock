(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('currentUserService', currentUserService);

    currentUserService.$inject = ['$q', 'coreDataservice', 'localService'];

    /* @ngInject */
    function currentUserService($q, coreDataservice, localService) {
        var getUserPromise;

        var service = {
            getUser: getUser,
            setUser: setUser
        };

        return service;

        function getUser() {

            return $q.when(getUserFromLocalStorage() || getUserFromHttp());
        }

        function setUser(user) {

            return localService.setUser(user);
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
    }
})();