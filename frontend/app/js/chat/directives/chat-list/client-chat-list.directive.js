(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('clientChatList', clientChatList);

    function clientChatList() {
        var directive = {
            bindToController: true,
            controller: ClientChatListController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                chats: '=',
                messages: '=',
                pagination: '=',
                currentRequest: '=',
                currentChat: '=',
                isScrollDisabled: '=?scrollChatDisabled',
                isScrollToBottomEnabled: '=?scrollChatToBottom',
                selectSpecialist: '&',
                loadPrevMessages: '&'
            },
            replace: true,
            templateUrl: 'chat/directives/chat-list/client-chat-list.html'
        };

        return directive;
    }

    ClientChatListController.$inject = ['chatSocketservice', '$mdSidenav', '$mdMedia', 'coreConstants', 'conf'];

    /* @ngInject */
    function ClientChatListController(chatSocketservice, $mdSidenav, $mdMedia, coreConstants, conf) {
        var vm = this;

        vm.chatSearch = '';

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;

        vm.changeCurrentChat = changeCurrentChat;

        activate();

        function getChats(currentRequest) {

            return chatSocketservice.getClientChats(currentRequest)
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

            vm.selectSpecialist({specialist: currentChat.specialist});

            if (!vm.pagination.messages[currentChat.id]) {
                vm.pagination.messages[currentChat.id] = {
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
            getChats(vm.currentRequest)
                .then(listenMessageEvent);
        }
    }
})();