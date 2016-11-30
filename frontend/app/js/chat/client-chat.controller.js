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
        vm.selectedSpecialist = {};

        vm.leftSidenavView = false;
        vm.selectedTab = 'chats';

        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.userType = coreConstants.USER_TYPES;

        vm.toggleSidenav = toggleSidenav;

        activate();

        function getCurrentUser() {

            return currentUserService.getUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;
                    vm.currentUser.type = coreConstants.USER_TYPES.CLIENT;

                    return vm.currentUser;
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

        function toggleSidenav(navID) {
            $mdSidenav(navID).toggle();
        }

        function activate() {
            $q.all([
                getCurrentUser(),
                getRequest(currentRequestId)
            ]);
        }
    }
})();