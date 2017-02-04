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
                selectedChat: '=?',
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

    SpecialistChatListController.$inject = [
        '$q',
        '$mdSidenav',
        '$mdMedia',
        'conf',
        'coreConstants',
        'chatSocketservice',
        'mobileService'
    ];

    /* @ngInject */
    function SpecialistChatListController($q, $mdSidenav, $mdMedia, conf, coreConstants, chatSocketservice,
                                          mobileService) {
        var selectedChats = {};
        var vm = this;

        vm.chatSearch = '';

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);

        vm.changeCurrentChat = changeCurrentChat;

        activate();

        function getChat(chat) {
            if (!chat || !chat.id) {

                return;
            }

            return $q.when(selectedChats[chat.id] || chatSocketservice.getSpecialistChat(chat));
        }

        function getChats() {

            return chatSocketservice.getSpecialistChats()
                .then(function (chats) {
                    vm.chats = chats;

                    return vm.chats;
                });
        }

        function changeCurrentChat(chat) {
            if (chat === null) {
                vm.currentChat = null;

                return $q.resolve();
            }

            if (vm.currentChat && vm.currentChat.id === chat.id) {

                return $q.resolve();
            }

            vm.isScrollDisabled = true;
            vm.isScrollToBottomEnabled = true;

            if (!$mdMedia('gt-md')) {
                $mdSidenav('left-sidenav').close();
            }

            getChat(chat)
                .then(function (chat) {
                    selectedChats[chat.id] = chat;
                    vm.currentChat = chat;

                    return vm.currentChat;
                })
                .then(function () {
                    vm.changeCurrentRequest({request: chat.request});
                });
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
            getChats()
                .then(function () {

                    return setCurrentChat(vm.selectedChat);
                });
        }
    }
})();