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

            return $sails.get(conf.URL_PREFIX + 'group/requests', params)
                .then(getRequestsComplete);

            function getRequestsComplete(response) {

                return response.data;
            }
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