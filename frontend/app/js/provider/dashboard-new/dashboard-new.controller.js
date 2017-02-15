(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('SpecialistNewRequestsController', SpecialistNewRequestsController);

    SpecialistNewRequestsController.$inject = [
        'conf',
        'coreConstants',
        'coreDataservice',
        'chatSocketservice',
        'mobileService',
    ];

    /* @ngInject */
    function SpecialistNewRequestsController(conf, coreConstants, coreDataservice, chatSocketservice, mobileService) {
        var promises = {
            loadRequests: null
        };

        var vm = this;

        vm.requests = [];

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.isAllMessagesLoaded = false;

        vm.pagination = {
            totalCount: 0,
            currentPageNumber: 1,
            limit: coreConstants.PAGINATION_OPTIONS.limit
        };

        vm.loadPrevRequests = loadPrevRequests;

        activate();

        function loadRequests(queryOptions) {
            if (promises.loadRequests) {
                promises.loadRequests.cancel();
            }

            promises.loadRequests = coreDataservice.getNewRequests(queryOptions);

            return promises.loadRequests
                .then(function (response) {

                    return response.data;
                });
        }

        function loadPrevRequests() {
            if (vm.isAllMessagesLoaded) {

                return;
            }

            var params = {
                order: 'updatedAt DESC',
                limit: vm.pagination.limit,
                page: vm.pagination.currentPageNumber
            };

            return loadRequests(params)
                .then(function (requests) {
                    vm.requests = vm.requests.concat(requests.items);
                    vm.pagination.totalCount = requests.totalCount;

                    vm.isAllMessagesLoaded = vm.pagination.currentPageNumber * vm.pagination.limit >=
                        vm.pagination.totalCount;

                    vm.pagination.currentPageNumber++;

                    return vm.requests;
                });
        }

        function listenRequestEvent() {
            chatSocketservice.onRequest(function (request, type) {
                if (type !== 'create') {

                    return;
                }

                vm.requests.unshift(request);
            });
        }

        function activate() {
            listenRequestEvent();
            loadPrevRequests();
        }
    }
})();