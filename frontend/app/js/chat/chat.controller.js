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
        var chatPaginationOptions = coreConstants.CHAT_PAGINATION_OPTIONS;
        var vm = this;

        vm.chats = [];
        vm.messages = {};
        vm.currentUser = {};
        vm.currentChat = null;

        vm.selectedRequestId = $stateParams.requestId;
        vm.pagination = {};
        vm.isAllMessagesLoaded = {};

        vm.replyMessage = {};
        vm.textareaGrow = {};

        vm.chatSearch = '';
        vm.leftSidenavView = false;
        vm.isScrollToBottomEnabled = true;

        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.changeCurrentChat = changeCurrentChat;
        vm.toggleSidenav = toggleSidenav;
        vm.loadPrevMessages = loadPrevMessages;
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

        function loadMessages(chat, params) {

            return chatSocketservice.getMessages(chat, params)
                .then(function (messages) {

                    return messages;
                });
        }

        function loadPrevMessages() {
            if (!vm.currentChat.id || vm.isAllMessagesLoaded[vm.currentChat.id]) {

                return;
            }

            var params = {
                limit: chatPaginationOptions.limit,
                page: vm.pagination[vm.currentChat.id].currentPageNumber
            };

            return loadMessages(vm.currentChat, params)
                .then(function (messages) {
                    vm.messages[vm.currentChat.id] = vm.messages[vm.currentChat.id].concat(messages.items);

                    vm.pagination[vm.currentChat.id].totalCount = messages.totalCount;
                    vm.isAllMessagesLoaded[vm.currentChat.id] =
                        vm.pagination[vm.currentChat.id].currentPageNumber * chatPaginationOptions.limit >=
                        vm.pagination[vm.currentChat.id].totalCount;

                    vm.pagination[vm.currentChat.id].currentPageNumber++;

                    vm.isScrollDisabled = false;

                    return vm.messages[vm.currentChat.id];
                });
        }

        function sendMessage(chat, message) {

            return chatSocketservice.sendMessage(chat, message)
                .then(function (message) {

                    return message;
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

                loadPrevMessages(currentChat);
            }
        }

        function listenMessageEvent() {
            chatSocketservice.onMessage(function (message) {
                if(!message || !message.chat || !message.chat.id || !angular.isArray(vm.messages[message.chat.id])) {

                    return;
                }

                vm.messages[message.chat.id].push(message);
            });
        }

        function reply(event, replyMessage, currentChat) {
            if (event && event.shiftKey && event.keyCode === 13) {
                vm.textareaGrow[currentChat.id] = true;

                return;
            }

            if (!event || event.keyCode === 13) {
                if (!replyMessage) {
                    clearReplyMessage(currentChat);

                    return;
                }

                var message = {
                    message: replyMessage,
                    recipient: currentChat.specialist
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
                getChats(vm.selectedRequestId)
            ])
                .then(function () {
                    listenMessageEvent();
                });
        }
    }
})();