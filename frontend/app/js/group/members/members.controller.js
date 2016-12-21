(function () {
    'use strict';

    angular
        .module('app.group')
        .controller('GroupMembersController', GroupMembersController);

    GroupMembersController.$inject = ['$mdMedia', 'conf', 'coreConstants', 'groupDataservice'];

    /* @ngInject */
    function GroupMembersController($mdMedia, conf, coreConstants, groupDataservice) {
        var vm = this;

        vm.members = [];

        vm.isAllMembersLoaded = false;

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.paginationOptions = coreConstants.PAGINATION_OPTIONS;
        vm.paginationOptions = coreConstants.PAGINATION_OPTIONS;

        vm.queryOptions = {
            orderBy: '-createdAt',
            limit: vm.paginationOptions.limit,
            page: 1,
            totalCount: 0
        };

        vm.getGroupMembers = getGroupMembers;
        vm.loadMoreGroupMembers = loadMoreGroupMembers;
        vm.removeMember = removeMember;

        activate();

        function getMembers() {
            var queryOptions = {
                order: vm.queryOptions.orderBy.replace(/-(\w+)/, '$1 DESC'),
                limit: vm.queryOptions.limit,
                page: vm.queryOptions.page
            };

            return groupDataservice.getMembers(queryOptions)
                .then(function (members) {

                    return members;
                });
        }

        function getGroupMembers() {

            return getMembers()
                .then(function (members) {
                    vm.members = members.items;
                    vm.queryOptions.totalCount = members.totalCount;

                    return vm.members;
                });
        }

        function loadMoreGroupMembers() {
            if (vm.isAllMembersLoaded) {

                return;
            }

            return getMembers()
                .then(function (members) {
                    vm.members = vm.members.concat(members.items);
                    vm.queryOptions.totalCount = members.totalCount;

                    vm.isAllMembersLoaded = vm.queryOptions.page * vm.queryOptions.limit >=
                        vm.queryOptions.totalCount;

                    vm.queryOptions.page++;

                    return vm.members;
                });
        }

        function removeMember(removedMember) {
            if (!removedMember || !removedMember.id) {

                return;
            }

            vm.members = vm.members.filter(function (member) {

                return member.id !== removedMember.id;
            });
        }

        function activate() {
            if ($mdMedia('gt-xs')) {
                getGroupMembers();
            }
        }
    }
})();

