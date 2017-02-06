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
                currentRequest: '=',
                currentChat: '=',
                chatSearch: '=?',
                isScrollDisabled: '=?scrollChatDisabled',
                isScrollToBottomEnabled: '=?scrollChatToBottom'
            },
            replace: true,
            templateUrl: 'chat/directives/chat-list/client-chat-list.html'
        };

        return directive;
    }

    ClientChatListController.$inject = [
        '$q',
        '$mdSidenav',
        '$mdMedia',
        'conf',
        'coreConstants',
        'chatSocketservice',
        'mobileService'
    ];

    /* @ngInject */
    function ClientChatListController($q, $mdSidenav, $mdMedia, conf, coreConstants, chatSocketservice, mobileService) {
        var vm = this;

        vm.chatSearch = '';

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);

        vm.changeCurrentChat = changeCurrentChat;

        activate();

        function getChats(currentRequest) {

            return chatSocketservice.getClientChats(currentRequest)
                .then(function (chats) {
                    vm.chats = chats;

                    return vm.chats;
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

            vm.isScrollDisabled = true;
            vm.isScrollToBottomEnabled = true;

            if (!$mdMedia('gt-md')) {
                $mdSidenav('left-sidenav').close();
            }
        }

        function setCurrentChat(chat) {
            if (vm.chats.length === 0) {

                return $q.resolve();
            }

            if (!chat || !chat.id) {

                chat = vm.chats[0];
            }

            return changeCurrentChat(chat);
        }

        function activate() {
            getChats(vm.currentRequest)
                .then(function () {

                    return setCurrentChat(vm.currentChat);
                });
        }
    }
})();