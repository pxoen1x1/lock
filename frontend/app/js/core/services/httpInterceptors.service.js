(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('httpInterceptors', httpInterceptors);

    httpInterceptors.$inject = ['$q', '$injector'];

    /* @ngInject */
    function httpInterceptors($q, $injector) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError(response) {
            var toast = $injector.get('toastService');

            var reg = /^20+.$/;
            var isStatusOk = reg.test(response.status);
            var message = response.data && response.data.message ? ': ' + response.data.message : '';

            if (response.status > 0 && !isStatusOk) {
                toast.error('Server error' + message);
            }

            return $q.reject(response);
        }
    }
})();