(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$q', '$stateParams', '$mdSidenav', '$mdMedia', 'conf',
        'coreConstants', 'currentUserService', 'chatSocketservice', '$sails'];

    /* @ngInject */
    function ChatController($q, $stateParams, $mdSidenav, $mdMedia, conf,
                            coreConstants, currentUserService, chatSocketservice) {
        var vm = this;

        vm.chats = [];
        vm.messages = [];
        vm.currentUser = {};
        vm.currentChat = null;

        vm.selectedRequestId = $stateParams.requestId;
        vm.pagination = {
            totalCount: 0,
            currentPageNumber: 0
        };

        vm.replyMessage = '';
        vm.chatSearch = '';
        vm.textareaGrow = false;
        vm.leftSidenavView = false;

        vm.defaultPortrait = conf.FRONT_URL + coreConstants.IMAGES.defaultPortrait;
        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.changeCurrentChat = changeCurrentChat;
        vm.toggleSidenav = toggleSidenav;
        vm.reply = reply;

        activate();

        function getCurrentUser() {

            return currentUserService.getUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;

                    return vm.currentUser;
                });
        }

        function getChats(selectedRequestId) {

            return chatSocketservice.getChats(selectedRequestId)
                .then(function (chats) {
                    vm.chats = chats;

                    return vm.chats;
                });
        }

        function loadMessages(chat) {
            var params = {
                page: vm.pagination.currentPageNumber
            };

            return chatSocketservice.getMessages(chat, params)
                .then(function (messages) {


                    return messages;
                });
        }

        function sendMessage(chat, message) {

            return chatSocketservice.sendMessage(chat, message)
                .then(function (message) {

                    return message;
                });
        }

        function changeCurrentChat(chat) {
            if (chat === null) {
                vm.currentChat = null;

                return;
            }

            if (vm.currentChat && vm.currentChat.id === chat.id) {

                return;
            }

            vm.currentChat = chat;

            vm.messages = [];

            clearReplyMessage();

            if (!$mdMedia('gt-md')) {
                $mdSidenav('left-sidenav').close();
            }

            return loadMessages(chat)
                .then(function (messages) {
                    vm.messages = messages.items;

                    vm.pagination.currentPageNumber = messages.currentPageNumber;
                    vm.pagination.totalCount = messages.totalCount;

                    return vm.messages;
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

                var chat = vm.currentChat;
                var message = {
                    message: replyMessage,
                    recipient: vm.currentChat.specialist
                };

                return sendMessage(chat, message)
                    .then(function (message) {
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
            $q.all([
                getCurrentUser(),
                getChats(vm.selectedRequestId)
            ]);
        }
    }
})();