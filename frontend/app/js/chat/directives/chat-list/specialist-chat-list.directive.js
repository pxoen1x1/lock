(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('specialistChatList', specialistChatList);

    function specialistChatList() {
        var directive = {
            bindToController: true,
            controller: SpecialistChatListController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                chats: '=',
                messages: '=',
                pagination: '=',
                currentChat: '=',
                currentRequest: '=?',
                isScrollDisabled: '=?scrollChatDisabled',
                isScrollToBottomEnabled: '=?scrollChatToBottom',
                loadPrevMessages: '&'
            },
            replace: true,
            templateUrl: 'chat/directives/chat-list/specialist-chat-list.html'
        };

        return directive;
    }

    SpecialistChatListController.$inject = ['chatSocketservice', '$mdSidenav', '$mdMedia', 'coreConstants', 'conf'];

    /* @ngInject */
    function SpecialistChatListController(chatSocketservice, $mdSidenav, $mdMedia, coreConstants, conf) {
        var vm = this;

        vm.chatSearch = '';

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.changeCurrentChat = changeCurrentChat;

        activate();

        function getChats() {

            return chatSocketservice.getSpecialistChats()
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

        function listenChatEvent() {
            chatSocketservice.onChat(function (chat) {

                vm.chats.push(chat);
            });
        }

        function changeCurrentChat(currentChat) {
            if (currentChat === null) {
                vm.currentChat = null;

                return;
            }

            vm.currentRequest = currentChat.request;

            if (vm.currentChat && vm.currentChat.id === currentChat.id) {

                return;
            }

            vm.currentChat = currentChat;

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
            getChats()
                .then(function () {
                        listenMessageEvent();
                        listenChatEvent();
                    }
                );
        }
    }
})();