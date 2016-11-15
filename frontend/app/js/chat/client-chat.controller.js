(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ClientChatController', ClientChatController);

    ClientChatController.$inject = [
        '$q',
        '$stateParams',
        '$mdSidenav',
        'coreConstants',
        'currentUserService',
        'currentRequestService',
    ];

    /* @ngInject */
    function ClientChatController($q, $stateParams, $mdSidenav, coreConstants, currentUserService,
                                  currentRequestService) {
        var currentRequestId = $stateParams.requestId;
        var vm = this;

        vm.chats = [];
        vm.bids = [];
        vm.messages = {};
        vm.reviews = {};

        vm.currentUser = {};
        vm.currentChat = null;
        vm.currentBid = null;

        vm.currentRequest = {};

        vm.leftSidenavView = false;
        vm.selectedTab = 'chats';

        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.userType = coreConstants.USER_TYPES;

        vm.toggleSidenav = toggleSidenav;
        vm.selectSpecialist = selectSpecialist;

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
                .then(function (currentUserType) {
                    vm.currentUser.type = currentUserType;

                    return currentUserType;
                });
        }

        function getRequest(requestId) {
            var request = {
                id: requestId
            };

            return currentRequestService.getRequest(request)
                .then(function (request) {
                    vm.currentRequest = request;
                });
        }


        function selectSpecialist(specialist) {
            vm.selectedSpecialist = specialist;
        }

        function toggleSidenav(navID) {
            $mdSidenav(navID).toggle();
        }

        function activate() {
            $q.all([
                getCurrentUser(),
                getRequest(currentRequestId)
            ])
                .then(function () {
                    getCurrentUserType();
                });
        }
    }
})();