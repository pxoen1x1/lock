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
                if (chat.owner.id === curentUser.id) {

                    return chat.contact;
                }

                return chat.owner;
            });

            return contacts;
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

                var now = new Date();

                var message = {
                    who: 'user',
                    message: replyMessage,
                    time: now.toISOString()
                };

                vm.chat.push(message);
                vm.selectedContact.lastMessage = message;

                clearReplyMessage();
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