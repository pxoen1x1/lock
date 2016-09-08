(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$mdSidenav', '$mdMedia', 'conf', 'coreConstants', 'currentUserService'];

    /* @ngInject */
    function ChatController($mdSidenav, $mdMedia, conf, coreConstants, currentUserService) {
        var vm = this;

        vm.contacts = [];
        vm.chat = [];
        vm.selectedContact = {};

        vm.replyMessage = '';
        vm.chatSearch = '';
        vm.textareaGrow = false;
        vm.leftSidenavView = false;

        vm.user = currentUserService.getUser();
        vm.defaultPortrait = conf.FRONT_URL + coreConstants.IMAGES.defaultPortrait;
        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.getChat = getChat;
        vm.toggleSidenav = toggleSidenav;
        vm.reply = reply;

        activate();

        function getChat(contact) {
            vm.selectedContact = contact;

            clearReplyMessage();

            if (!$mdMedia('gt-md')) {
                $mdSidenav('left-sidenav').close();
            }
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
        }
    }
})();