(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('localService', localService);

    function localService() {
        var authKeyName = 'auth';
        var userKeyName = 'user';
        var languageKeyName = 'language';
        var deviceInfoKeyName = 'device';

        var service = {
            get: get,
            getAuth: getAuth,
            getUser: getUser,
            getLanguage: getLanguage,
            getDeviceInfo: getDeviceInfo,
            set: set,
            setAuth: setAuth,
            setUser: setUser,
            setLanguage: setLanguage,
            setDeviceInfo: setDeviceInfo,
            remove: remove,
            removeAuth: removeAuth,
            removeUser: removeUser,
            removeLanguage: removeLanguage,
            removeDeviceInfo: removeDeviceInfo,
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

        function getLanguage() {
            var language = get(languageKeyName);

            try {
                return angular.fromJson(language);
            }
            catch (err) {

                return language;
            }
        }

        function getDeviceInfo() {
            var deviceInfo = get(deviceInfoKeyName);

            try {
                return angular.fromJson(deviceInfo);
            }
            catch (err) {

                return deviceInfo;
            }
        }

        function set(key, value) {
            if (!key || !value) {

                return;
            }

            return localStorage.setItem(key, value);
        }

        function setAuth(auth) {

            return set(authKeyName, JSON.stringify(auth));
        }

        function setUser(user) {

            return set(userKeyName, JSON.stringify(user));
        }

        function setLanguage(language) {

            return set(languageKeyName, JSON.stringify(language));
        }

        function setDeviceInfo(deviceInfo) {

            return set(deviceInfoKeyName, JSON.stringify(deviceInfo));
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

        function removeLanguage() {

            return remove(languageKeyName);
        }

        function removeDeviceInfo() {

            return remove(deviceInfoKeyName);
        }

        function clear() {

            return localStorage.clear();
        }
    }
})();