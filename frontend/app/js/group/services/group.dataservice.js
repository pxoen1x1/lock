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
            getMembers: getMembers,
            getMember: getMember,
            searchGroupMember: searchGroupMember,
            inviteMember: inviteMember,
            removeMemberFromGroup: removeMemberFromGroup
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

        function getMember(member) {

            return $sails.get(conf.URL_PREFIX + 'group/members/' + member.id)
                .then(getMemberComplete);

            function getMemberComplete(response) {

                return response.data.user;
            }
        }

        function searchGroupMember(params) {

            return $sails.get(conf.URL_PREFIX + 'group/members/search', params)
                .then(findGroupMemberComplete);

            function findGroupMemberComplete(response) {

                return response.data;
            }
        }

        function inviteMember(email) {

            return $sails.post(conf.URL_PREFIX + 'group/members/invite', email)
                .then(inviteMemberComplete);

            function inviteMemberComplete(response) {

                return response.data.invitation;
            }
        }

        function removeMemberFromGroup(member) {

            return $sails.delete(conf.URL_PREFIX + 'group/members/' + member.id)
                .then(removeMemberFromGroupComplete);

            function removeMemberFromGroupComplete(response) {

                return response.data.user;
            }
        }
    }
})();