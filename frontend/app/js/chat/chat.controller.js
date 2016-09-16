(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$sails', '$stateParams', '$mdSidenav', '$mdMedia', 'conf',
        'coreConstants', 'currentUserService', 'chatSocketservice'];

    /* @ngInject */
    function ChatController($sails, $stateParams, $mdSidenav, $mdMedia, conf,
                            coreConstants, currentUserService, chatSocketservice) {
        var vm = this;

        vm.chats = [];
        vm.messages = [];
        vm.user = {};
        vm.selectedChat = {};

        vm.selectedRequestId = $stateParams.requestId;

        vm.replyMessage = '';
        vm.chatSearch = '';
        vm.textareaGrow = false;
        vm.leftSidenavView = false;

        vm.defaultPortrait = conf.FRONT_URL + coreConstants.IMAGES.defaultPortrait;
        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.getChat = getChat;
        vm.toggleSidenav = toggleSidenav;
        vm.reply = reply;

        activate();

        function getCurrentUser() {

            return currentUserService.getUser()
                .then(function (currentUser) {
                    vm.user = currentUser;

                    return vm.user;
                });
        }

        function getChat(chat) {
            vm.selectedChat = chat;

            clearReplyMessage();

            if (!$mdMedia('gt-md')) {
                $mdSidenav('left-sidenav').close();
            }
        }

        function getChatContacts(selectedRequestId) {

            return chatSocketservice.getChats(selectedRequestId)
                .then(function (chats) {
                    vm.chats = chats;

                    return vm.chats;
                });
        }

        function sendMessage(chat, message) {

            return chatSocketservice.sendMessage(chat, message)
                .then(function (message) {

                    return message;
                });
        }

        function reply(event, replyMessage) {
            if (event && event.shiftKey && event.keyCode === 13) {
                vm.textareaGrow = true;

                return;
            }

            if (!event || event.keyCode === 13) {
                if (!replyMessage) {
                    clearReplyMessage();

                    return;
                }

                var chat = vm.selectedChat;
                var message = {
                    message: replyMessage,
                    recipient: vm.selectedChat.specialist.id
                };

                return sendMessage(chat, message)
                    .then(function (message) {
                        message.who = 'user';

                        vm.messages.push(message);

                        clearReplyMessage();
                    });
            }
        }

        function clearReplyMessage() {
            vm.replyMessage = '';
            vm.textareaGrow = false;
        }


        function toggleSidenav(navID) {
            $mdSidenav(navID).toggle();
        }

        function activate() {
            getCurrentUser();
            getChatContacts(vm.selectedRequestId);
        }
    }
})();