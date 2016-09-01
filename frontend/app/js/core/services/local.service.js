(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('localService', localService);

    function localService() {
        var service = {
            get: get,
            set: set,
            remove: remove,
            clear: clear
        };

        return service;

        function get(key) {

            return localStorage.getItem((key));
        }

        function set(key, value) {

            return localStorage.setItem(key, value);
        }

        function remove(key) {

            return localStorage.removeItem(key);
        }

        function clear() {

            return localStorage.clear();
        }
    }
})();