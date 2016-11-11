(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('SpecialistChatController', SpecialistChatController);

    SpecialistChatController.$inject = [
        '$mdSidenav',
        'coreConstants',
        'coreDataservice',
        'chatSocketservice',
        'currentUserService'
    ];

    /* @ngInject */
    function SpecialistChatController($mdSidenav, coreConstants, coreDataservice, chatSocketservice,
                                      currentUserService) {
        var promises = {
            getRequest: null
        };
        var vm = this;

        vm.chats = [];
        vm.messages = {};
        vm.requests = {};

        vm.currentUser = {};
        vm.currentChat = null;
        vm.currentBid = null;

        vm.isInfoTabOpen = false;

        vm.selectedTab = 'chats';

        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.userType = coreConstants.USER_TYPES;

        vm.toggleSidenav = toggleSidenav;
        vm.changeCurrentRequest = changeCurrentRequest;

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
            chatSocketservice.onRequest(function (request, type, isBlast) {
                if (type !== 'update') {

                    return;
                }

                if (request.executor.id === vm.currentUser.id && !isBlast) {
                    updateRequest(request);
                }

                if (request.executor.id !== vm.currentUser.id && isBlast) {
                    updateRequest(request);
                }
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

        function updateRequest(request) {
            if (!request) {

                return;
            }

            vm.requests[request.id] = request;

            if (vm.currentRequest && vm.currentRequest.id === request.id) {
                vm.currentRequest = request;
            }
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