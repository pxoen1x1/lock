(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('AdminUsersClientsController', AdminUsersClientsController);

    AdminUsersClientsController.$inject = [
        '$mdMedia',
        'conf',
        'coreConstants',
        'adminDataservice',
        'mobileService'
    ];

    /* @ngInject */
    function AdminUsersClientsController($mdMedia, conf, coreConstants, adminDataservice, mobileService) {
        var promises = {
            getAllUsers: null
        };

        var vm = this;

        vm.users = [];

        vm.baseUrl = conf.BASE_URL;
        vm.paginationOptions = coreConstants.PAGINATION_OPTIONS;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);
        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.isAllUsersLoaded = false;

        vm.queryOptions = {
            orderBy: '-createdAt',
            limit: vm.paginationOptions.limit,
            page: 1,
            totalCount: 0
        };

        vm.getUsers = getUsers;
        vm.getMoreUsers = getMoreUsers;

        activate();

        function getAllUsers(queryOptions) {
            if (promises.getAllUsers) {
                promises.getAllUsers.cancel();
            }

            promises.getAllUsers = adminDataservice.getUsers(queryOptions);

            return promises.getAllUsers
                .then(function (response) {

                    return response.data;
                });
        }

        function getUsers() {
            var queryOptions = {
                order: vm.queryOptions.orderBy.replace(/-(\w+(\.\w+)*)/, '$1 DESC'),
                limit: vm.queryOptions.limit,
                page: vm.queryOptions.page,
                isEnabled: true,
                isProvider: false
            };

            return getAllUsers(queryOptions)
                .then(function (users) {
                    vm.users = users.items;
                    vm.queryOptions.totalCount = users.totalCount;

                    return vm.users;
                });
        }

        function getMoreUsers() {
            if (vm.isAllUsersLoaded) {

                return;
            }

            var queryOptions = {
                order: vm.queryOptions.orderBy.replace(/-(\w+(\.\w+)*)/, '$1 DESC'),
                limit: vm.queryOptions.limit,
                page: vm.queryOptions.page,
                isEnabled: true,
                isProvider: false
            };

            return getAllUsers(queryOptions)
                .then(function (users) {
                    vm.users = vm.users.concat(users.items);
                    vm.queryOptions.totalCount = users.totalCount;

                    vm.isAllUsersLoaded = vm.queryOptions.page * vm.queryOptions.limit >=
                        vm.queryOptions.totalCount;

                    vm.queryOptions.page++;

                    return vm.users;
                });
        }

        function activate() {
            if ($mdMedia('gt-xs')) {
                getUsers();
            }
        }
    }
})();