(function () {
    'use strict';

    angular
        .module('app.group')
        .controller('FindGroupMemberDialogController', FindGroupMemberDialogController);

    FindGroupMemberDialogController.$inject = ['$q', '$mdDialog', 'groupDataservice', 'coreConstants'];

    /* @ngInject */
    function FindGroupMemberDialogController($q, $mdDialog, groupDataservice, coreConstants) {
        var prevGroupMemberQuery = '';
        var vm = this;

        vm.members = [];
        vm.groupMemberQuery = '';

        vm.isAllGroupMemberLoaded = false;

        vm.pagination = {
            totalCount: 0,
            currentPageNumber: 1,
            limit: coreConstants.PAGINATION_OPTIONS.limit
        };

        vm.loadGroupMember = loadGroupMember;
        vm.changeGroupMemberQuery = changeGroupMemberQuery;
        vm.joinGroupMember = joinGroupMember;
        vm.cancel = cancel;

        activate();

        function getGroupMember(query) {
            var queryOptions = {
                query: query,
                limit: vm.pagination.limit,
                page: vm.pagination.currentPageNumber
            };

            return groupDataservice.searchGroupMember(queryOptions)
                .then(function (members) {

                        return members;
                    }
                );
        }

        function loadGroupMember(query) {
            if (query.length < 3) {

                return $q.reject();
            }

            return getGroupMember(query)
                .then(function (members) {
                    if (prevGroupMemberQuery !== query) {
                        vm.members = members.items;
                    } else {
                        vm.members = vm.members.concat(members.items);
                    }

                    vm.pagination.totalCount = members.totalCount;

                    vm.isAllGroupMemberLoaded = vm.pagination.currentPageNumber * vm.pagination.limit >=
                        vm.pagination.totalCount;

                    vm.pagination.currentPageNumber++;

                    prevGroupMemberQuery = query;

                    return vm.members;
                });
        }

        function changeGroupMemberQuery() {
            if (vm.groupMemberQuery === prevGroupMemberQuery) {

                return;
            }

            vm.pagination.currentPageNumber = 1;

            loadGroupMember(vm.groupMemberQuery);
        }

        function joinGroupMember(groupMember) {

            $mdDialog.hide(groupMember);
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function activate() {
        }
    }
})();