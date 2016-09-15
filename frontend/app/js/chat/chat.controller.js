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

        vm.contacts = [];
        vm.chats = [];
        vm.user = {};
        vm.selectedContact = {};

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

        function getChat(contact) {
            vm.selectedContact = contact;

            clearReplyMessage();

            if (!$mdMedia('gt-md')) {
                $mdSidenav('left-sidenav').close();
            }
        }

        function getChatContacts(selectedRequestId, curentUser) {

            return chatSocketservice.getChats(selectedRequestId)
                .then(function (chats) {
                    vm.contacts = getContacts(chats, curentUser);

                    return vm.contacts;
                });
        }

        function getContacts(chats, curentUser) {
            if (!angular.isArray(chats)) {

                return chats;
            }

            var contacts;

            contacts = chats.map(function (chat) {
                var result = (chat.owner.id === curentUser.id) ? chat.contact : chat.owner;

                if (!result) {

                    return chat;
                }

                result.chat = chat;

                return result;
            });

            return contacts;
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

                var chat = vm.selectedContact.chat;
                var message = {
                    message: replyMessage,
                    recipient: vm.selectedContact.id
                };

                return sendMessage(chat, message)
                    .then(function (message) {
                        message.who = 'user';

                        vm.chats.push(message);

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
            getCurrentUser()
                .then(function (currentUser) {

                    return getChatContacts(vm.selectedRequestId, currentUser);
                });
        }
    }
})();