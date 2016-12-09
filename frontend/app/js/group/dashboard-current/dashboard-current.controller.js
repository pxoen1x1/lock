(function () {
    'use strict';

    angular
        .module('app.group')
        .controller('GroupDashboardCurrentController', GroupDashboardCurrentController);

    GroupDashboardCurrentController.$inject = ['$mdMedia', 'coreConstants', 'groupDataservice', 'conf'];

    /* @ngInject */
    function GroupDashboardCurrentController($mdMedia, coreConstants, groupDataservice, conf) {
        var promises = {
            getAllRequests: null
        };

        var vm = this;

        vm.requests = [];

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.paginationOptions = coreConstants.PAGINATION_OPTIONS;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;

        vm.isAllRequestsLoaded = false;

        vm.queryOptions = {
            orderBy: '-createdAt',
            limit: vm.paginationOptions.limit,
            page: 1,
            totalCount: 0
        };

        vm.getRequests = getRequests;
        vm.getMoreRequests = getMoreRequests;

        activate();

        function getAllRequests(queryOptions) {
            if (promises.getAllRequests) {
                promises.getAllRequests.cancel();
            }

            promises.getAllRequests = groupDataservice.getRequests(queryOptions);

            return promises.getAllRequests
                .then(function (response) {

                    return response.data;
                });
        }

        function getRequests() {
            var queryOptions = {
                'status[]': [coreConstants.REQUEST_STATUSES.PENDING, coreConstants.REQUEST_STATUSES.IN_PROGRESS],
                order: vm.queryOptions.orderBy.replace(/-(\w+)/, '$1 DESC'),
                limit: vm.queryOptions.limit,
                page: vm.queryOptions.page
            };

            return getAllRequests(queryOptions)
                .then(function (requests) {
                    vm.requests = requests.items;
                    vm.paginationOptions.totalCount = requests.totalCount;

                    return vm.requests;
                });
        }

        function getMoreRequests() {
            if (vm.isAllRequestsLoaded) {

                return;
            }

            var queryOptions = {
                status: '!' + coreConstants.REQUEST_STATUSES.CLOSED,
                order: vm.queryOptions.orderBy.replace(/-(\w+)/, '$1 DESC'),
                limit: vm.queryOptions.limit,
                page: vm.queryOptions.page
            };

            return getAllRequests(queryOptions)
                .then(function (requests) {
                    vm.requests = vm.requests.concat(requests.items);
                    vm.paginationOptions.totalCount = requests.totalCount;

                    vm.isAllRequestsLoaded = vm.queryOptions.page * vm.queryOptions.limit >=
                        vm.paginationOptions.totalCount;

                    vm.queryOptions.page++;

                    return vm.requests;
                });
        }

        function activate() {
            if ($mdMedia('gt-xs')) {
                getRequests();
            }
        }
    }
})();