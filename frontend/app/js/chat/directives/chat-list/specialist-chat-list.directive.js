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
                currentChat: '=',
                currentRequest: '=?',
                chatSearch: '=?',
                isScrollDisabled: '=?scrollChatDisabled',
                isScrollToBottomEnabled: '=?scrollChatToBottom',
                changeCurrentRequest: '&'
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

        vm.changeCurrentChat = changeCurrentChat;

        activate();

        function getChats() {

            return chatSocketservice.getSpecialistChats()
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

            vm.changeCurrentRequest({request: currentChat.request});

            vm.isScrollDisabled = true;
            vm.isScrollToBottomEnabled = true;

            if (!$mdMedia('gt-md')) {
                $mdSidenav('left-sidenav').close();
            }
        }

        function activate() {
            getChats();
        }
    }
})();