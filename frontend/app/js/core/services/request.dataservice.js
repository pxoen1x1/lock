(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('request', request);

    request.$inject = ['$http', '$q'];

    function request($http, $q) {
        var service = {
            httpWithTimeout: httpWithTimeout
        };

        return service;

        function httpWithTimeout() {
            var http = $q.defer();
            var args = arguments.length > 0 ? arguments : [{}];

            args[0].timeout = http.promise;

            var request = $http.apply($http, args);
            var promise = request.then(function (response) {

                return response;
            });

            promise._http = http;

            promise.cancel = function () {
                if (this.$$state.status === 0) {
                    this._http.resolve();
                }
            };

            return promise;
        }
    }
})();