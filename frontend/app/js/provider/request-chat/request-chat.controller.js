(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('SpecialistRequestChatController', SpecialistRequestChatController);

    SpecialistRequestChatController.$inject = [
        '$scope',
        '$q',
        '$stateParams',
        '$mdSidenav',
        'coreConstants',
        'coreDataservice',
        'currentUserService',
        'chatSocketservice',
        'serviceProviderDataservice'
    ];

    /* @ngInject */
    function SpecialistRequestChatController($scope, $q, $stateParams, $mdSidenav, coreConstants, coreDataservice,
                                             currentUserService, chatSocketservice, serviceProviderDataservice) {
        var requestHandler;
        var chatHandler;
        var promises = {
            getRequest: null
        };
        var currentRequestId = $stateParams.requestId;
        var vm = this;

        vm.messages = [];

        vm.currentUser = {};

        vm.selectedTab = 'chats';
        vm.isInfoTabOpen = false;

        vm.requestStatus = coreConstants.REQUEST_STATUSES;

        vm.toggleSidenav = toggleSidenav;

        activate();

        function getCurrentUser() {

            return currentUserService.getUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;
                    vm.currentUser.type = coreConstants.USER_TYPES.SPECIALIST;

                    return vm.currentUser;
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

        function getCurrentRequest(requestId) {
            var request = {
                id: requestId
            };

            return getRequest(request)
                .then(function (request) {
                    vm.currentRequest = request;

                    return vm.currentRequest;
                });
        }

        function getCurrentChat(request) {

            return serviceProviderDataservice.getChatByRequest(request)
                .then(function (chat) {
                    vm.currentChat = chat;

                    return vm.currentChat;
                });
        }

        function listenRequestEvent() {
            requestHandler = chatSocketservice.onRequest(function (request, type, isBlast) {
                if (type !== 'update') {

                    return;
                }

                if (request.executor.id === vm.currentUser.id && !isBlast) {
                    vm.currentRequest = request;
                }

                if (request.executor.id !== vm.currentUser.id && isBlast) {
                    vm.currentRequest = request;
                }
            });
        }

        function listenChatEvent() {
            chatHandler = chatSocketservice.onChat(function (chat, type) {
                if (type === 'create') {
                    if (vm.currentRequest.id === chat.request.id) {
                        vm.currentChat = chat;
                    }
                }
            });
        }

        function toggleSidenav(navID) {
            $mdSidenav(navID).toggle();
        }

        function activate() {
            $q.all([
                getCurrentRequest(currentRequestId),
                getCurrentUser()
            ])
                .then(function () {
                    listenRequestEvent();

                    getCurrentChat(vm.currentRequest)
                        .then(listenChatEvent);
                });

            $scope.$on('$destroy', function () {
                chatSocketservice.offRequest(requestHandler);
                chatSocketservice.offChat(chatHandler);
            });
        }
    }
})();