(function () {
    'use strict';

    angular
        .module('app.provider')
        .factory('serviceProviderDataservice', serviceProviderDataservice);

    serviceProviderDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function serviceProviderDataservice($http, request, conf) {
        var service = {
            getServices: getServices
        };

        return service;

        function getServices() {
            return request.httpWithTimeout({
                url: conf.URL + 'lists/services',
                method: 'GET'
            });
        }
    }
})();