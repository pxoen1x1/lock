(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('OfferDialogController', OfferDialogController);

    OfferDialogController.$inject = [
        '$q',
        '$mdDialog',
        'coreConstants',
        'currentUserService',
        'chatSocketservice',
        'groupDataservice',
        'currentChat'
    ];

    /* @ngInject */
    function OfferDialogController($q, $mdDialog, coreConstants, currentUserService, chatSocketservice,
                                   groupDataservice, currentChat) {
        var prevGroupMemberQuery = '';
        var vm = this;

        vm.offer = {};
        vm.groupMembers = [];
        vm.groupMemberQuery = '';
        vm.currentUser = {};
        vm.currentUserType = null;

        vm.isAllGroupMemberLoaded = false;

        vm.pagination = {
            totalCount: 0,
            currentPageNumber: 1,
            limit: coreConstants.PAGINATION_OPTIONS.limit
        };

        vm.userType = coreConstants.USER_TYPES;

        vm.loadGroupMember = loadGroupMember;
        vm.sendOffer = sendOffer;
        vm.cancel = cancel;

        activate();

        function getCurrentUser() {

            return currentUserService.getUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;

                    return vm.currentUser;
                });
        }

        function getCurrentUserType() {

            return currentUserService.getType()
                .then(function (userType) {
                    vm.currentUserType = userType;

                    return vm.currentUserType;
                });
        }

        function getGroupMember(queryOptions) {

            return groupDataservice.searchGroupMember(queryOptions)
                .then(function (members) {

                        return members;
                    }
                );
        }

        function createOffer(chat, offer) {
            var newOffer = {
                offer: offer
            };

            return chatSocketservice.createOffer(chat, newOffer)
                .then(function (createdOffer) {

                    return createdOffer;
                });
        }

        function loadGroupMember(query) {
            if (prevGroupMemberQuery !== query) {
                vm.pagination.currentPageNumber = 1;
                vm.isAllGroupMemberLoaded = false;
            }

            if (query.length < 3 || vm.isAllGroupMemberLoaded) {

                return $q.reject();
            }

            var queryOptions = {
                query: query,
                limit: vm.pagination.limit,
                page: vm.pagination.currentPageNumber
            };

            return getGroupMember(queryOptions)
                .then(function (groupMembers) {
                    if (prevGroupMemberQuery !== query) {
                        vm.groupMembers = groupMembers.items;
                    } else {
                        vm.groupMembers = vm.groupMembers.concat(groupMembers.items);
                    }

                    vm.pagination.totalCount = groupMembers.totalCount;

                    vm.isAllGroupMemberLoaded = vm.pagination.currentPageNumber * vm.pagination.limit >=
                        vm.pagination.totalCount;

                    vm.pagination.currentPageNumber++;

                    prevGroupMemberQuery = query;

                    return vm.groupMembers;
                });
        }

        function addGroupMemberToChat(groupMember) {
            if (groupMember && groupMember.id) {
                var isGroupMember = currentChat.members
                    .some(function (chatMember) {

                        return chatMember.id === groupMember.id;
                    });

                if (!isGroupMember) {
                    var member = {
                        member: groupMember
                    };

                    return chatSocketservice.joinGroupMemberToChat(currentChat, member);
                }
            }

            return $q.resolve();
        }

        function removeGroupAdminFromGroupMembers() {

            vm.groupMembers = vm.groupMembers.filter(function (groupMember) {

                return groupMember.id !== vm.currentUser.id;
            });
        }

        function sendOffer(offer, isFormValid) {
            if (!isFormValid) {

                return;
            }

            addGroupMemberToChat(offer.executor)
                .then(function () {
                    return createOffer(currentChat, offer);
                })
                .then(function (createdOffer) {

                    return $mdDialog.hide(createdOffer);
                });
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function activate() {
            vm.groupMembers = angular.isArray(currentChat.members) ? currentChat.members : vm.groupMembers;

            getCurrentUser()
                .then(getCurrentUserType)
                .then(removeGroupAdminFromGroupMembers);
        }
    }
})();