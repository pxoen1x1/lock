(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderDashboardCurrentController', ProviderDashboardCurrentController);

    ProviderDashboardCurrentController.$inject = ['coreConstants', 'serviceProviderDataservice'];

    /* @ngInject */
    function ProviderDashboardCurrentController(coreConstants, serviceProviderDataservice) {
        var promises = {
            getAllRequests: null
        };

        var vm = this;

        vm.paginationOptions = coreConstants.PAGINATION_OPTIONS;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;

        vm.queryOptions = {
            orderBy: '-updatedAt',
            limit: vm.paginationOptions.limit,
            page: 1,
            totalCount: 0
        };

        vm.getRequests = getRequests;

        activate();

        function getAllRequests(queryOptions) {
            if (promises.getAllRequests) {
                promises.getAllRequests.cancel();
            }

            promises.getAllRequests = serviceProviderDataservice.getRequests(queryOptions);

            return promises.getAllRequests
                .then(function (response) {

                    return response.data;
                });
        }

        function getRequests() {
            var queryOptions = {
                status: '!4',
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

        function activate() {
            getRequests();
        }
    }
})();