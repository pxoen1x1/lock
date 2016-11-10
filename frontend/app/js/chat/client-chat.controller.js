(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ClientChatController', ClientChatController);

    ClientChatController.$inject = [
        '$q',
        '$stateParams',
        '$mdSidenav',
        'coreConstants',
        'currentUserService',
        'chatSocketservice',
        'currentRequestService',
    ];

    /* @ngInject */
    function ClientChatController($q, $stateParams, $mdSidenav, coreConstants, currentUserService, chatSocketservice,
                                  currentRequestService) {
        var currentRequestId = $stateParams.requestId;
        var vm = this;

        vm.chats = [];
        vm.bids = [];
        vm.messages = {};
        vm.reviews = {};

        vm.currentUser = {};
        vm.currentChat = null;
        vm.currentBid = null;

        vm.currentRequest = {};
        vm.pagination = {
            reviews: {}
        };

        vm.leftSidenavView = false;
        vm.selectedTab = 'chats';

        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.userType = coreConstants.USER_TYPES;

        vm.toggleSidenav = toggleSidenav;
        vm.loadPrevReviews = loadPrevReviews;
        vm.selectSpecialist = selectSpecialist;

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

        function getRequest(requestId) {
            var request = {
                id: requestId
            };

            return currentRequestService.getRequest(request)
                .then(function (request) {
                    vm.currentRequest = request;
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


        function selectSpecialist(specialist) {
            vm.selectedSpecialist = specialist;

            if (!vm.reviews[specialist.id]) {
                loadPrevReviews(specialist);
            }
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