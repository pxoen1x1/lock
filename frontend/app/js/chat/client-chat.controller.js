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
        'chatSocketservice',
    ];

    /* @ngInject */
    function ClientChatController($q, $stateParams, $mdSidenav, coreConstants, currentUserService,
                                  currentRequestService, chatSocketservice) {

        var currentRequestId = $stateParams.requestId;
        var currentChatId = $stateParams.chatId;
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

        function setCurrentChat(chatId) {

            return chatSocketservice.getClientChats(vm.currentRequest)
                .then(function (chats) {
                    vm.chats = chats;
                    chats.forEach(function(chat){
                        if(chat.id === chatId){
                            vm.currentChat = chat;

                            return;
                        }
                    })

                    return vm.chats;
                });
        }

        function toggleSidenav(navID) {
            $mdSidenav(navID).toggle();
        }

        function activate() {
            $q.all([
                getCurrentUser(),
                getRequest(currentRequestId)
                    .then(function(){

                        return setCurrentChat(currentChatId);
                    })
            ]);
        }
    }
})();