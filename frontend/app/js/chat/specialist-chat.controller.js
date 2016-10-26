(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('SpecialistChatController', SpecialistChatController);

    SpecialistChatController.$inject = [
        '$mdSidenav',
        '$mdDialog',
        'coreConstants',
        'coreDataservice',
        'chatSocketservice',
        'currentUserService',
        'geocoderService',
        'conf'
    ];

    /* @ngInject */
    function SpecialistChatController($mdSidenav, $mdDialog, coreConstants, coreDataservice,
                                      chatSocketservice, currentUserService, geocoderService, conf) {
        var promises = {
            getRequest: null
        };
        var chatPaginationOptions = coreConstants.CHAT_PAGINATION_OPTIONS;
        var vm = this;

        vm.chats = [];
        vm.messages = {};
        vm.requests = {};

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
        vm.changeCurrentRequest = changeCurrentRequest;
        vm.openOfferDialog = openOfferDialog;
        vm.updateRequestStatus = updateRequestStatus;
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

        function listenRequestEvent() {
            chatSocketservice.onRequest(function (request, type) {
                if (type !== 'update') {

                    return;
                }

                vm.requests[request.id] = request;

                if (vm.currentRequest && vm.currentRequest.id === request.id) {
                    vm.currentRequest = request;
                }
            });
        }

        function loadMessages(chat, params) {

            return chatSocketservice.getMessages(chat, params)
                .then(function (messages) {

                    return messages;
                });
        }

        function getRequest(request) {
            if (promises.getRequest) {
                promises.getRequest.cancel();
            }

            var userType = 'specialist';

            promises.getRequest = coreDataservice.getRequest(userType, request);

            return promises.getRequest
                .then(function (response) {

                    return response.data.request;
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

        function changeCurrentRequest(request) {
            if (!request || !request.id) {

                return;
            }

            if (vm.requests[request.id]) {
                vm.currentRequest = vm.requests[request.id];

                return;
            }

            return getRequest(request)
                .then(function (request) {
                    vm.requests[request.id] = request;
                    vm.currentRequest = request;

                    return request;
                });
        }

        function updateRequestStatus(request, status) {
            if (!request || !status) {

                return;
            }

            return coreDataservice.updateRequestStatus(request, status)
                .then(function (updatedRequest) {
                    if (updatedRequest.status === vm.requestStatus.IN_PROGRESS) {
                        geocoderService.startGeoTracking();
                    } else {
                        geocoderService.stopGeoTracking();
                    }

                    return updatedRequest;
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
            if ((event && event.shiftKey && event.keyCode === 13) ||
                currentRequest.status === vm.requestStatus.CLOSED) {

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

            listenRequestEvent();
        }
    }
})();