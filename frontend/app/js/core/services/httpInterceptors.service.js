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
            auth = angular.fromJson(auth);

            if (auth && auth.token) {
                request.headers.Authorization = 'Bearer ' + auth.token;
            }

            return request;
        }

        function responseError(response) {
            var toast = $injector.get('toastService');
            var reg = /^20+.$/;
            var isStatusOk = reg.test(response.status);
            var message = response.data && response.data.message ? ': ' + response.data.message : '';

            if (response.status > 0 && !isStatusOk) {
                if (response.status === 401 || response.status === 403) {
                    localService.removeAuth();
                }

                toast.error('Server error' + message);
            }

            return $q.reject(response);
        }
    }
})();