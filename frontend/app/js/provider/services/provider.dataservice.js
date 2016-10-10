(function () {
    'use strict';

    angular
        .module('app.provider')
        .factory('serviceProviderDataservice', serviceProviderDataservice);

    serviceProviderDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function serviceProviderDataservice($http, request, conf) {
        var service = {
            getRequests: getRequests
        };

        return service;

        function getRequests(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'specialist/requests',
                method: 'GET',
                params: params
            });
        }
    }
})();