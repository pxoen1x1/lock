(function () {
    'use strict';

    var chatMessagesConfig = {
        controller: ChatMessagesController,
        controllerAs: 'vm',
        templateUrl: 'chat/components/chat-messages/chat-messages.html',
        replace: true,
        bindings: {
            chats: '=',
            bids: '=',
            messages: '=',
            currentUser: '=',
            currentRequest: '=',
            selectedTab: '=',
            currentChat: '=',
            currentBid: '=',
            toggleSidenav: '&'
        }
    };

    angular
        .module('app.chat')
        .component('chatMessages', chatMessagesConfig);

    ChatMessagesController.$inject = [
        '$scope',
        '$q',
        '$state',
        '$mdDialog',
        'coreConstants',
        'coreDataservice',
        'chatSocketservice',
        'currentRequestService',
        'geocoderService',
        'conf'
    ];

    /* @ngInject */
    function ChatMessagesController($scope, $q, $state, $mdDialog, coreConstants, coreDataservice, chatSocketservice,
                                    currentRequestService, geocoderService, conf) {
        var isAllMessagesLoaded = {};
        var pagination = {
            messages: {}
        };
        var chatPaginationOptions = coreConstants.CHAT_PAGINATION_OPTIONS;
        var vm = this;

        vm.chats = vm.chats || [];
        vm.bids = vm.bids || [];
        vm.messages = vm.messages || {};
        vm.replyMessage = {};
        vm.textareaGrow = {};

        vm.baseUrl = conf.BASE_URL;
        vm.userType = coreConstants.USER_TYPES;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;

        vm.isScrollDisabled = true;
        vm.isScrollToBottomEnabled = true;

        vm.sendMessage = sendMessage;
        vm.loadPrevMessages = loadPrevMessages;
        vm.updateRequestStatus = updateRequestStatus;
        vm.acceptOffer = acceptOffer;
        vm.openOfferDialog = openOfferDialog;
        vm.reply = reply;
        vm.onFileLoaded = onFileLoaded;

        activate();

        function sendMessage(chat, message) {

            return chatSocketservice.sendMessage(chat, message)
                .then(function (message) {

                    return message;
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

            if ((!currentChat || !currentChat.id) || isAllMessagesLoaded[currentChat.id]) {

                return;
            }

            var params = {
                limit: chatPaginationOptions.limit,
                page: pagination.messages[currentChat.id].currentPageNumber
            };

            return loadMessages(currentChat, params)
                .then(function (messages) {
                    if (!angular.isArray(vm.messages[currentChat.id])) {
                        vm.messages[currentChat.id] = [];
                    }

                    vm.messages[currentChat.id] = vm.messages[currentChat.id].concat(messages.items);

                    pagination.messages[currentChat.id].totalCount = messages.totalCount;
                    isAllMessagesLoaded[currentChat.id] =
                        pagination.messages[currentChat.id].currentPageNumber * chatPaginationOptions.limit >=
                        pagination.messages[currentChat.id].totalCount;

                    pagination.messages[currentChat.id].currentPageNumber++;

                    vm.isScrollDisabled = false;

                    return vm.messages[currentChat.id];
                });
        }

        function loadCurrentChatMessages(currentChat) {
            if (!currentChat || !currentChat.id) {

                return;
            }

            if (!pagination.messages[currentChat.id]) {
                pagination.messages[currentChat.id] = {
                    currentPageNumber: 1,
                    totalCount: 0
                };
            }

            if (!vm.messages[currentChat.id]) {
                vm.messages[currentChat.id] = [];

                return loadPrevMessages(currentChat);
            }
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

        function acceptOffer(offer, message) {
            if ((!vm.currentRequest || !vm.currentRequest.id) || (!offer || !offer.executor || !offer.cost)) {

                return $q.reject();
            }

            var request = {
                request: offer
            };

            message = {
                message: message
            };

            return sendMessage(vm.currentChat, message)
                .then(function () {

                    return coreDataservice.acceptOffer(vm.currentRequest.id, request);

                })
                .then(function (updatedRequest) {
                    vm.currentRequest = updatedRequest;
                    currentRequestService.setRequest(updatedRequest);

                    $state.go('customer.requests.request.view');

                    return vm.currentRequest;
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
                currentRequest.status === vm.requestStatus.CLOSED ||
                (currentRequest.status !== vm.requestStatus.NEW &&
                currentRequest.executor.id !== currentChat.specialist.id)) {

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
                        if (!angular.isArray(vm.messages[currentChat.id])) {
                            vm.messages[currentChat.id] = [];
                        }

                        vm.messages[currentChat.id].push(message);

                        clearReplyMessage(currentChat);
                    });
            }
        }

        function clearReplyMessage(currentChat) {
            vm.replyMessage[currentChat.id] = '';
            vm.textareaGrow[currentChat.id] = false;
        }

        function onFileLoaded(response) {
            var file = response.files[0];
            var message = {
                message: vm.baseUrl + file.fd,
                sender: vm.currentUser,
                updatedAt: (new Date()).toISOString()
            };

            vm.messages[vm.currentChat.id].push(message);

            return sendMessage(vm.currentChat, {message: message});
        }

        function activate() {
            loadCurrentChatMessages(vm.currentChat);

            $scope.$watch('vm.currentChat.id', function (newCurrentChatId, oldCurrentChatId) {
                if (!newCurrentChatId || newCurrentChatId === oldCurrentChatId) {

                    return;
                }

                loadCurrentChatMessages(vm.currentChat);
            });
        }
    }
})();