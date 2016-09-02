(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('localService', localService);

    function localService() {
        var authKeyName = 'auth';
        var userKeyName = 'user';

        var service = {
            get: get,
            getAuth: getAuth,
            getUser: getUser,
            set: set,
            setAuth: setAuth,
            setUser: setUser,
            remove: remove,
            removeAuth: removeAuth,
            removeUser: removeUser,
            clear: clear
        };

        return service;

        function get(key) {

            return localStorage.getItem((key));
        }

        function getAuth() {
            var auth = get(authKeyName);

            try {
                return angular.fromJson(auth);
            }
            catch (err) {

                return auth;
            }
        }

        function getUser() {
            var user = get(userKeyName);

            try {
                return angular.fromJson(user);
            }
            catch (err) {

                return user;
            }

        }

        function set(key, value) {

            return localStorage.setItem(key, value);
        }

        function setAuth(auth) {

            return set(authKeyName, JSON.stringify(auth));
        }

        function setUser(user) {

            return set(userKeyName, JSON.stringify(user));
        }

        function remove(key) {

            return localStorage.removeItem(key);
        }

        function removeAuth() {

            return remove(authKeyName);
        }

        function removeUser() {

            return remove(userKeyName);
        }

        function clear() {

            return localStorage.clear();
        }
    }
})();