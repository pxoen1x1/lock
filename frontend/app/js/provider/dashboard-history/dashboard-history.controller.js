(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderDashboardHistoryController', ProviderDashboardHistoryController);

    ProviderDashboardHistoryController.$inject = ['$mdMedia', 'coreConstants', 'serviceProviderDataservice', 'conf'];

    /* @ngInject */
    function ProviderDashboardHistoryController($mdMedia, coreConstants, serviceProviderDataservice, conf) {
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

        vm.getHistoryRequests = getHistoryRequests;
        vm.loadMoreHistoryRequests = loadMoreHistoryRequests;

        activate();

        function getRequests() {
            if (promises.getRequests) {
                promises.getRequests.cancel();
            }

            var queryOptions = {
                status: [coreConstants.REQUEST_STATUSES.DONE, coreConstants.REQUEST_STATUSES.CLOSED],
                order: vm.queryOptions.orderBy.replace(/-(\w+)/, '$1 DESC'),
                limit: vm.queryOptions.limit,
                page: vm.queryOptions.page
            };

            promises.getRequests = serviceProviderDataservice.getRequests(queryOptions);

            return promises.getRequests
                .then(function (response) {

                    return response.data;
                });
        }

        function getHistoryRequests() {

            return getRequests()
                .then(function (requests) {
                    vm.requests = requests.items;
                    vm.queryOptions.totalCount = requests.totalCount;

                    return vm.requests;
                });
        }

        function loadMoreHistoryRequests() {
            if (vm.isAllRequestsLoaded) {

                return;
            }

            return getRequests()
                .then(function (requests) {
                    vm.requests = vm.requests.concat(requests.items);
                    vm.queryOptions.totalCount = requests.totalCount;

                    vm.isAllRequestsLoaded = vm.queryOptions.page * vm.queryOptions.limit >=
                        vm.queryOptions.totalCount;

                    vm.queryOptions.page++;

                    return vm.requests;
                });
        }

        function activate() {
            if ($mdMedia('gt-xs')) {
                getHistoryRequests();
            }
        }
    }
})();