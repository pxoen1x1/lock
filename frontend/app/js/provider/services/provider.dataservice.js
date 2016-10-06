(function () {
    'use strict';

    angular
        .module('app.provider')
        .factory('serviceProviderDataservice', serviceProviderDataservice);

    serviceProviderDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function serviceProviderDataservice($http, request, conf) {
        var service = {
            getAllRequests: getAllRequests,
            getCurrentRequests: getCurrentRequests
        };

        return service;

        function getAllRequests(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'specialist/requests/all',
                method: 'GET',
                params: params
            });
        }

        function getCurrentRequests(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'specialist/requests/current',
                method: 'GET',
                params: params
            });
        }
    }
})();