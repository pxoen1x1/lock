(function () {
    'use strict';

    angular
        .module('app.provider')
        .factory('serviceProviderDataservice', serviceProviderDataservice);

    serviceProviderDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function serviceProviderDataservice($http, request, conf) {
        var service = {
            getProcedures: getProcedures
        };

        return service;

        function getProcedures(params) {

            return request.httpWithTimeout({
                url: conf.URL + 'services/procedures',
                method: 'GET',
                params: params,
                withCredentials: false
            });
        }
    }
})();