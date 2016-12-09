(function () {
    'use strict';

    angular
        .module('app.group')
        .factory('groupDataservice', groupDataservice);

    groupDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function groupDataservice($http, request, conf) {
        var service = {
            getRequests: getRequests
        };

        return service;

        function getRequests(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'group/requests',
                method: 'GET',
                params: params
            });
        }
    }
})();