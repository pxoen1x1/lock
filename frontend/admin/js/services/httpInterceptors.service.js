(function () {
    'use strict';

    angular
        .module('app')
        .factory('httpInterceptors', httpInterceptors);

    httpInterceptors.$inject = ['$q', '$injector'];

    /* @ngInject */
    function httpInterceptors($q, $injector) {
        var localService = $injector.get('localService');

        var service = {
            request: request,
            responseError: responseError
        };

        return service;

        function request(request) {
            var auth = localService.getAuth();

            if (auth && auth.token) {
                if (request.socket) {
                    request.socket.headers = {
                        Authorization: 'Bearer ' + auth.token
                    };
                } else {
                    request.headers.Authorization = 'Bearer ' + auth.token;
                }
            }

            return request;
        }

        function responseError(response) {
            if (response.data) {
                if (angular.isString(response.data)) {
                    response.data = JSON.parse(response.data);
                }

                var toast = $injector.get('toastService');
                var reg = /^20+.$/;
                var isStatusOk = reg.test(response.status);
                var message = response.data.message;

                if (response.status > 0 && !isStatusOk) {
                    if (response.status === 401) {
                        localService.removeAuth();
                    }

                    toast.error(message);
                }
            }

            return $q.reject(response);
        }
    }
})();