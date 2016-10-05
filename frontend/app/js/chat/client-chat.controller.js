(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ClientChatController', ClientChatController);

    ClientChatController.$inject = ['$q', '$state', '$stateParams', '$mdSidenav', 'coreConstants', 'currentUserService',
        'chatSocketservice', 'requestService', 'conf'];

    /* @ngInject */
    function ClientChatController($q, $state, $stateParams, $mdSidenav, coreConstants, currentUserService,
                                  chatSocketservice, requestService, conf) {
        var currentRequestId = $stateParams.requestId;
        var chatPaginationOptions = coreConstants.CHAT_PAGINATION_OPTIONS;
        var vm = this;

        vm.chats = [];
        vm.bids = [];
        vm.messages = {};
        vm.reviews = {};

        vm.currentUser = {};
        vm.currentChat = null;

        vm.currentRequest = {};
        vm.pagination = {
            messages: {},
            reviews: {}
        };
        vm.isAllMessagesLoaded = {};

        vm.replyMessage = {};
        vm.textareaGrow = {};

        vm.isScrollDisabled = true;
        vm.isScrollToBottomEnabled = true;

        vm.leftSidenavView = false;
        vm.selectedTab = 'chats';

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.dateFormat = coreConstants.DATE_FORMAT;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.userType = coreConstants.USER_TYPES;

        vm.toggleSidenav = toggleSidenav;
        vm.loadPrevMessages = loadPrevMessages;
        vm.loadPrevReviews = loadPrevReviews;
        vm.changeRequestStatus = changeRequestStatus;
        vm.selectSpecialist = selectSpecialist;
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

        function getRequest(request) {

            return requestService.getRequest(request)
                .then(function (request) {
                    vm.currentRequest = request;
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

        function loadPrevReviews() {
            if (!vm.pagination.reviews[vm.selectedSpecialist.id]) {
                vm.pagination.reviews[vm.selectedSpecialist.id] = {
                    page: 1,
                    totalCount: 0,
                    isAllReviewsLoad: false
                };
            }

            if (vm.pagination.reviews[vm.selectedSpecialist.id].isAllReviewsLoad) {

                return $q.reject;
            }

            var params = {
                limit: coreConstants.PAGINATION_OPTIONS.limit,
                page: vm.pagination.reviews[vm.selectedSpecialist.id].page
            };

            return chatSocketservice.getReviews(vm.selectedSpecialist, params)
                .then(function (reviews) {
                    if (!angular.isArray(vm.reviews[vm.selectedSpecialist.id])) {
                        vm.reviews[vm.selectedSpecialist.id] = [];
                    }

                    vm.reviews[vm.selectedSpecialist.id] =
                        vm.reviews[vm.selectedSpecialist.id].concat(reviews.items);

                    vm.pagination.reviews[vm.selectedSpecialist.id].isAllReviewsLoad = reviews.totalCount <=
                        vm.pagination.reviews[vm.selectedSpecialist.id].page * coreConstants.PAGINATION_OPTIONS.limit;
                    vm.pagination.reviews[vm.selectedSpecialist.id].totalCount = reviews.totalCount;

                    vm.pagination.reviews[vm.selectedSpecialist.id].page++;

                    return vm.reviews[vm.selectedSpecialist.id];
                });
        }

        function sendMessage(chat, message) {

            return chatSocketservice.sendMessage(chat, message)
                .then(function (message) {

                    return message;
                });
        }

        function changeRequestStatus(offer, message) {
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

                    return chatSocketservice.updateRequest(vm.currentRequest.id, request);

                })
                .then(function (updatedRequest) {
                    vm.currentRequest = updatedRequest;
                    requestService.setRequest(updatedRequest);

                    $state.go('customer.requests.request.view');

                    return vm.currentRequest;
                });
        }

        function selectSpecialist(specialist) {
            vm.selectedSpecialist = specialist;

            if (!vm.reviews[specialist.id]) {
                loadPrevReviews(specialist);
            }
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
            $q.all([
                getCurrentUser(),
                getRequest(currentRequestId)
            ])
                .then(function () {
                    getCurrentUserType();
                });
        }
    }
})();