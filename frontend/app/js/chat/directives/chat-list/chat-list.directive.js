(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('chatList', chatList);

    function chatList() {
        var directive = {
            bindToController: true,
            controller: ChatListController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                messages: '=',
                pagination: '=',
                selectedRequest: '=',
                currentChat: '=',
                loadPrevMessages: '&',
                isScrollDisabled: '=?scrollChatDisabled',
                isScrollToBottomEnabled: '=?scrollChatToBottom'
            },
            replace: true,
            templateUrl: 'chat/directives/chat-list/chat-list.html'
        };

        return directive;
    }

    ChatListController.$inject = ['chatSocketservice', '$mdSidenav', '$mdMedia', 'coreConstants'];

    /* @ngInject */
    function ChatListController(chatSocketservice, $mdSidenav, $mdMedia, coreConstants) {
        var vm = this;

        vm.chats = [];
        vm.message = vm.message || {};
        vm.pagination = vm.pagination || {};
        vm.isScrollDisabled = vm.isScrollDisabled || true;
        vm.isScrollToBottomEnabled = vm.isScrollToBottomEnabled || true;

        vm.chatSearch = '';

        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.changeCurrentChat = changeCurrentChat;

        activate();

        function getChats(selectedRequestId) {

            return chatSocketservice.getChats(selectedRequestId)
                .then(function (chats) {
                    vm.chats = chats;

                    return vm.chats;
                });
        }

        function listenMessageEvent() {
            chatSocketservice.onMessage(function (message) {
                if (!message || !message.chat || !message.chat.id || !angular.isArray(vm.messages[message.chat.id])) {

                    return;
                }

                vm.messages[message.chat.id].push(message);
            });
        }

        function changeCurrentChat(currentChat) {
            if (currentChat === null) {
                vm.currentChat = null;

                return;
            }

            if (vm.currentChat && vm.currentChat.id === currentChat.id) {

                return;
            }

            vm.currentChat = currentChat;

            if (!vm.pagination[currentChat.id]) {
                vm.pagination[currentChat.id] = {
                    currentPageNumber: 1,
                    totalCount: 0
                };
            }

            vm.isScrollDisabled = true;
            vm.isScrollToBottomEnabled = true;

            if (!$mdMedia('gt-md')) {
                $mdSidenav('left-sidenav').close();
            }

            if (!vm.messages[currentChat.id]) {
                vm.messages[currentChat.id] = [];

                vm.loadPrevMessages({currentChat: currentChat});
            }
        }

        function activate() {
            getChats(vm.selectedRequest)
                .then(listenMessageEvent);
        }
    }
})();