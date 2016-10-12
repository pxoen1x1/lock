(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('SpecialistNewRequestsController', SpecialistNewRequestsController);

    SpecialistNewRequestsController.$inject = ['coreDataservice', 'chatSocketservice', 'conf', 'coreConstants'];

    /* @ngInject */
    function SpecialistNewRequestsController(coreDataservice, chatSocketservice, conf, coreConstants) {
        var promises = {
            loadRequests: null
        };

        var vm = this;

        vm.requests = [];

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.paginationOptions = coreConstants.PAGINATION_OPTIONS;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.dateFormat = coreConstants.DATE_FORMAT;


        vm.queryOptions = {
            limit: vm.paginationOptions.limit,
            page: 1,
            totalCount: 0
        };

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
            var queryOptions = {
                order: 'updatedAt DESC',
                limit: vm.queryOptions.limit,
                page: vm.queryOptions.page
            };

            return loadRequests(queryOptions)
                .then(function (requests) {
                    vm.requests = vm.requests.concat(requests.items);
                    vm.paginationOptions.totalCount = requests.totalCount;

                    return vm.requests;
                });
        }

        function listenRequestEvent() {
            chatSocketservice.onRequest(function (request) {
                vm.requests.unshift(request);
            });
        }

        function activate() {
            loadPrevRequests()
                .then(function () {
                    listenRequestEvent();
                });
        }
    }
})();