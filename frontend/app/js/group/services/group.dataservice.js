(function () {
    'use strict';

    angular
        .module('app.group')
        .factory('groupDataservice', groupDataservice);

    groupDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function groupDataservice($http, request, conf) {
        var service = {
            getSpecialistsRequests: getSpecialistsRequests
        };

        return service;

        function getSpecialistsRequests(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'group/requests',
                method: 'GET',
                params: params
            });
        }
    }
})();