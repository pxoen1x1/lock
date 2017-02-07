(function () {
    'use strict';

    angular
        .module('app.core')
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
            var reg = /^20+.$/;
            var isStatusOk = reg.test(response.status);

            if (response.status > 0 && !isStatusOk) {
                if (response.status === 401) {
                    var $state = $injector.get('$state');

                    localService.removeAuth();
                    $state.go('home.main');
                }

                if (response.data) {
                    if (angular.isString(response.data)) {
                        response.data = JSON.parse(response.data);
                    }

                    var message = response.data.message;

                    if (message) {
                        var toast = $injector.get('toastService');

                        toast.error(message);
                    }
                }
            }

            return $q.reject(response);
        }
    }
})();