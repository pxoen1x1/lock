(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderDashboardCurrentController', ProviderDashboardCurrentController);

    ProviderDashboardCurrentController.$inject = [
        '$mdMedia',
        'conf',
        'coreConstants',
        'serviceProviderDataservice',
        'mobileService'
    ];

    /* @ngInject */
    function ProviderDashboardCurrentController($mdMedia, conf, coreConstants, serviceProviderDataservice,
                                                mobileService) {
        var promises = {
            getRequests: null
        };

        var vm = this;

        vm.requests = [];

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);
        vm.paginationOptions = coreConstants.PAGINATION_OPTIONS;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;

        vm.isAllRequestsLoaded = false;

        vm.queryOptions = {
            orderBy: '-createdAt',
            limit: vm.paginationOptions.limit,
            page: 1,
            totalCount: 0
        };

        vm.getCurrentRequests = getCurrentRequests;
        vm.loadMoreCurrentRequests = loadMoreCurrentRequests;

        activate();

        function getRequests() {
            if (promises.getRequests) {
                promises.getRequests.cancel();
            }

            var queryOptions = {
                status: [coreConstants.REQUEST_STATUSES.PENDING, coreConstants.REQUEST_STATUSES.IN_PROGRESS, coreConstants.REQUEST_STATUSES.DONE],
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

        function getCurrentRequests() {

            return getRequests()
                .then(function (requests) {
                    vm.requests = requests.items;
                    vm.queryOptions.totalCount = requests.totalCount;

                    return vm.requests;
                });
        }

        function loadMoreCurrentRequests() {
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
                getCurrentRequests();
            }
        }
    }
})();