(function () {
    'use strict';

    var chatMessagesConfig = {
        controller: ChatMessagesController,
        controllerAs: 'vm',
        templateUrl: 'chat/components/chat-messages/chat-messages.html',
        replace: true,
        bindings: {
            messages: '=',
            currentUser: '=',
            currentRequest: '=',
            selectedSpecialist: '=',
            selectedTab: '=',
            currentChat: '=',
            currentBid: '=?',
            chats: '=?',
            bids: '=?',
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
        'conf',
        'coreConstants',
        'coreDataservice',
        'chatSocketservice',
        'currentRequestService',
        'geocoderService',
        'speechRecognition',
        'mobileService',
    ];

    /* @ngInject */
    function ChatMessagesController($scope, $q, $state, $mdDialog, conf, coreConstants, coreDataservice,
                                    chatSocketservice, currentRequestService, geocoderService, speechRecognition,
                                    mobileService) {
        var messageHandler;
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
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);
        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;

        vm.isScrollDisabled = true;
        vm.isScrollToBottomEnabled = true;
        vm.isMicrophoneAllowed = false;
        vm.recognizing = false;

        vm.hideChatsButton = false;

        vm.sendMessage = sendMessage;
        vm.loadPrevMessages = loadPrevMessages;
        vm.updateRequestStatus = updateRequestStatus;
        vm.acceptOffer = acceptOffer;
        vm.openOfferDialog = openOfferDialog;
        vm.reply = reply;
        vm.onFileLoaded = onFileLoaded;
        vm.startSpeechRecognition = startSpeechRecognition;
        vm.isChatDisabled = isChatDisabled;
        vm.joinGroupMember = joinGroupMember;

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

                return $q.reject();
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
            if (!currentChat || !currentChat.id || vm.messages[currentChat.id]) {

                return $q.reject();
            }

            if (!pagination.messages[currentChat.id]) {
                pagination.messages[currentChat.id] = {
                    currentPageNumber: 1,
                    totalCount: 0
                };
            }

            vm.messages[currentChat.id] = [];
            vm.isScrollDisabled = true;

            return loadPrevMessages(currentChat)
                .then(function () {

                    return chatSocketservice.subscribeToChat(vm.currentChat);
                });
        }

        function listenMessageEvent() {
            if (messageHandler) {

                return;
            }

            messageHandler = chatSocketservice.onMessage(function (message, type) {
                if (type !== 'create' || !message || !message.chat || !message.chat.id ||
                    !angular.isArray(vm.messages[message.chat.id])) {

                    return;
                }

                vm.messages[message.chat.id].push(message);
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
                templateUrl: 'chat/offer-dialog/offer-dialog.html',
                controller: 'OfferDialogController',
                controllerAs: 'vm',
                locals: {
                    currentChat: vm.currentChat
                }
            })
                .then(function (message) {
                    vm.messages[currentChat.id].push(message);

                    return message;
                });
        }

        function reply(event, replyMessage, currentChat) {
            if ((event && event.shiftKey && event.keyCode === 13) || isChatDisabled()) {
                if (currentChat) {
                    vm.textareaGrow[currentChat.id] = true;
                }

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
                message: file.fd,
                sender: vm.currentUser,
                updatedAt: file.uploadedAt
            };

            vm.messages[vm.currentChat.id].push(message);

            return sendMessage(vm.currentChat, {message: message});
        }

        function startSpeechRecognition() {
            if ((vm.selectedTab === 'bids' && vm.currentBid) || isChatDisabled()) {

                return;
            }

            if (vm.recognizing) {
                vm.recognizing = false;

                speechRecognition.stop();

            } else {
                vm.recognizing = true;

                speechRecognition.start()
                    .then(function (result) {
                        vm.replyMessage[vm.currentChat.id] = result;
                    })
                    .finally(function () {
                        vm.recognizing = false;
                    });
            }
        }

        function isChatDisabled() {
            if (!vm.currentChat || !vm.currentRequest) {

                return true;
            }

            if (!vm.currentRequest.executor) {

                return false;
            }

            var isRequestClosed = vm.currentRequest.status === vm.requestStatus.CLOSED;
            var isRequestNew = vm.currentRequest.status !== vm.requestStatus.NEW;
            var isRequestExecutorChatMember = vm.currentChat.members.some(function (member) {

                return member.id === vm.currentRequest.executor.id;
            });

            return isRequestClosed || (isRequestNew && !isRequestExecutorChatMember);
        }

        function joinGroupMember() {

            return $mdDialog.show({
                templateUrl: 'group/find-group-member-dialog/find-group-member-dialog.html',
                controller: 'FindGroupMemberDialogController',
                controllerAs: 'vm',
                bindToController: true,
                locals: {
                    chatMembers: vm.currentChat.members
                }
            })
                .then(function (selectedGroupMember) {
                    var member = {
                        member: selectedGroupMember
                    };

                    return chatSocketservice.joinGroupMemberToChat(vm.currentChat, member);
                })
                .then(function (member) {
                        if (!angular.isArray(vm.currentChat.members)) {

                            return;
                        }

                        vm.currentChat.members.push(member);
                    }
                );
        }

        function activate() {
            if($state.current.name === 'provider.dashboard.request.chat') {
                vm.hideChatsButton = true;
            }


            loadCurrentChatMessages(vm.currentChat)
                .then(function () {
                    listenMessageEvent();

                    return speechRecognition.isReady();
                })
                .then(function () {
                    vm.isMicrophoneAllowed = true;
                });

            $scope.$watch('vm.currentChat.id', function (newCurrentChatId, oldCurrentChatId) {
                if (!newCurrentChatId || newCurrentChatId === oldCurrentChatId) {

                    return;
                }

                loadCurrentChatMessages(vm.currentChat)
                    .then(listenMessageEvent);
            });

            $scope.$on('$destroy', function () {
                chatSocketservice.offMessage(messageHandler);
            });
        }
    }
})();