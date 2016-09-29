(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$q', '$state', '$stateParams', '$mdSidenav', 'coreConstants', 'currentUserService',
        'chatSocketservice', 'requestService'];

    /* @ngInject */
    function ChatController($q, $state, $stateParams, $mdSidenav, coreConstants, currentUserService,
                            chatSocketservice, requestService) {
        var selectedRequestId = $stateParams.requestId;
        var chatPaginationOptions = coreConstants.CHAT_PAGINATION_OPTIONS;
        var vm = this;

        vm.chats = [];
        vm.bids = [];
        vm.messages = {};

        vm.currentUser = {};
        vm.currentChat = null;

        vm.selectedRequest = {};
        vm.pagination = {};
        vm.isAllMessagesLoaded = {};

        vm.replyMessage = {};
        vm.textareaGrow = {};

        vm.isScrollDisabled = true;
        vm.isScrollToBottomEnabled = true;

        vm.leftSidenavView = false;
        vm.selectedTab = 'chats';

        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.dateFormat = coreConstants.DATE_FORMAT;
        vm.status = coreConstants.REQUEST_STATUSES;

        vm.toggleSidenav = toggleSidenav;
        vm.loadPrevMessages = loadPrevMessages;
        vm.changeRequestStatus = changeRequestStatus;
        vm.reply = reply;

        activate();

        function getCurrentUser() {

            return currentUserService.getUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;

                    return vm.currentUser;
                });
        }

        function getRequest(request) {

            return requestService.getRequest(request)
                .then(function (request) {
                    vm.selectedRequest = request;
                });
        }

        function loadMessages(chat, params) {

            return chatSocketservice.getMessages(chat, params)
                .then(function (messages) {

                    return messages;
                });
        }

        function loadPrevMessages(currentChat) {
            currentChat = currentChat || vm.currentChat;

            if ((!currentChat || !currentChat.id) || vm.isAllMessagesLoaded[currentChat.id]) {

                return;
            }

            var params = {
                limit: chatPaginationOptions.limit,
                page: vm.pagination[currentChat.id].currentPageNumber
            };

            return loadMessages(currentChat, params)
                .then(function (messages) {
                    vm.messages[currentChat.id] = vm.messages[currentChat.id].concat(messages.items);

                    vm.pagination[currentChat.id].totalCount = messages.totalCount;
                    vm.isAllMessagesLoaded[currentChat.id] =
                        vm.pagination[currentChat.id].currentPageNumber * chatPaginationOptions.limit >=
                        vm.pagination[currentChat.id].totalCount;

                    vm.pagination[currentChat.id].currentPageNumber++;

                    vm.isScrollDisabled = false;

                    return vm.messages[currentChat.id];
                });
        }

        function sendMessage(chat, message) {

            return chatSocketservice.sendMessage(chat, message)
                .then(function (message) {

                    return message;
                });
        }

        function changeRequestStatus(offer) {
            if ((!vm.selectedRequest || !vm.selectedRequest.id) || (!offer || !offer.executor)) {

                return $q.reject();
            }

            var request = {
                request: offer
            };

            return chatSocketservice.updateRequest(vm.selectedRequest.id, request)
                .then(function (updatedRequest) {
                    vm.selectedRequest = updatedRequest;
                    requestService.setRequest(updatedRequest);

                    $state.go('customer.requests.request.view');

                    return vm.selectedRequest;
                });
        }

        function reply(event, replyMessage, currentChat, selectedRequest) {
            if ((event && event.shiftKey && event.keyCode === 13) || selectedRequest.status !== 1) {
                vm.textareaGrow[currentChat.id] = true;

                return;
            }

            if (!event || event.keyCode === 13) {
                if (!replyMessage) {
                    clearReplyMessage(currentChat);

                    return;
                }

                var message = {
                    message: replyMessage
                };

                return sendMessage(currentChat, message)
                    .then(function (message) {
                        vm.messages[currentChat.id].push(message);

                        clearReplyMessage(currentChat);
                    });
            }
        }

        function clearReplyMessage(currentChat) {
            vm.replyMessage[currentChat.id] = '';
            vm.textareaGrow[currentChat.id] = false;
        }


        function toggleSidenav(navID) {
            $mdSidenav(navID).toggle();
        }

        function activate() {
            $q.all([
                getCurrentUser(),
                getRequest(selectedRequestId)
            ]);
        }
    }
})();