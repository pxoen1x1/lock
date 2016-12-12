(function () {
    'use strict';

    angular
        .module('app.group')
        .factory('groupDataservice', groupDataservice);

    groupDataservice.$inject = ['$sails', 'request', 'conf'];

    /* @ngInject */
    function groupDataservice($sails, request, conf) {
        var service = {
            getRequests: getRequests,
            getMembers: getMembers
        };

        return service;

        function getRequests(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'group/requests',
                method: 'GET',
                params: params
            });
        }

        function getMembers(params) {

            return $sails.get(conf.URL_PREFIX + 'group/members', params)
                .then(getMembersComplete);

            function getMembersComplete(response) {

                return response.data;
            }
        }
    }
})();