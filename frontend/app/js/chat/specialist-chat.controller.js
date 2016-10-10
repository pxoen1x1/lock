(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('SpecialistChatController', SpecialistChatController);

    SpecialistChatController.$inject = [
        '$mdSidenav',
        '$mdDialog',
        'coreConstants',
        'chatSocketservice',
        'currentUserService',
        'conf'
    ];

    /* @ngInject */
    function SpecialistChatController($mdSidenav, $mdDialog, coreConstants,
                                      chatSocketservice, currentUserService, conf) {
        var chatPaginationOptions = coreConstants.CHAT_PAGINATION_OPTIONS;
        var vm = this;

        vm.chats = [];
        vm.messages = {};

        vm.currentUser = {};
        vm.currentChat = null;

        vm.pagination = {
            messages: {}
        };

        vm.isAllMessagesLoaded = {};

        vm.replyMessage = {};
        vm.textareaGrow = {};

        vm.isInfoTabOpen = false;
        vm.isScrollDisabled = true;
        vm.isScrollToBottomEnabled = true;

        vm.selectedTab = 'chats';
        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.userType = coreConstants.USER_TYPES;

        vm.toggleSidenav = toggleSidenav;
        vm.loadPrevMessages = loadPrevMessages;
        vm.openOfferDialog = openOfferDialog;
        vm.reply = reply;

        activate();

        function getCurrentUser() {

            return currentUserService.getUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;

                    return vm.currentUser;
                });
        }

        function getCurrentUserType() {

            return currentUserService.getType()
                .then(function (currentUserType) {
                    vm.currentUser.type = currentUserType;

                    return currentUserType;
                });
        }

        function loadMessages(chat, params) {

            return chatSocketservice.getMessages(chat, params)
                .then(function (messages) {

                    return messages;
                });
        }

        function loadPrevMessages(currentChat) {
            currentChat = currentChat || vm.currentChat;

            if ((!currentChat || !currentChat.id) || vm.isAllMessagesLoaded[currentChat.id]) {

                return;
            }

            var params = {
                limit: chatPaginationOptions.limit,
                page: vm.pagination.messages[currentChat.id].currentPageNumber
            };

            return loadMessages(currentChat, params)
                .then(function (messages) {
                    vm.messages[currentChat.id] = vm.messages[currentChat.id].concat(messages.items);

                    vm.pagination.messages[currentChat.id].totalCount = messages.totalCount;
                    vm.isAllMessagesLoaded[currentChat.id] =
                        vm.pagination.messages[currentChat.id].currentPageNumber * chatPaginationOptions.limit >=
                        vm.pagination.messages[currentChat.id].totalCount;

                    vm.pagination.messages[currentChat.id].currentPageNumber++;

                    vm.isScrollDisabled = false;

                    return vm.messages[currentChat.id];
                });
        }

        function sendMessage(chat, message) {

            return chatSocketservice.sendMessage(chat, message)
                .then(function (message) {

                    return message;
                });
        }

        function openOfferDialog(currentChat) {

            return $mdDialog.show({
                templateUrl: 'chat/templates/offer-dialog.html',
                controller: 'OfferDialogController',
                controllerAs: 'vm'
            })
                .then(function (offer) {
                    var message = {
                        message: offer
                    };

                    return sendMessage(currentChat, message);
                })
                .then(function (message) {
                    vm.messages[currentChat.id].push(message);

                    return message;
                });
        }

        function reply(event, replyMessage, currentChat, currentRequest) {
            if ((event && event.shiftKey && event.keyCode === 13) || currentRequest.status !== vm.requestStatus.NEW) {
                vm.textareaGrow[currentChat.id] = true;

                return;
            }

            if (!event || event.keyCode === 13) {
                if (!replyMessage) {
                    clearReplyMessage(currentChat);

                    return;
                }

                var message = {
                    message: {
                        message: replyMessage
                    }
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
            getCurrentUser()
                .then(getCurrentUserType);
        }
    }
})();