(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('AdminUsersProvidersController', AdminUsersProvidersController);

    AdminUsersProvidersController.$inject = ['coreConstants', 'conf', 'adminDataservice'];

    /* @ngInject */
    function AdminUsersProvidersController(coreConstants, conf, adminDataservice) {
        var promises = {
            getAllUsers: null
        };

        var vm = this;

        vm.baseUrl = conf.BASE_URL;
        vm.paginationOptions = coreConstants.PAGINATION_OPTIONS;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.queryOptions = {
            orderBy: '-createdAt',
            limit: vm.paginationOptions.limit,
            page: 1,
            totalCount: 0
        };

        vm.getUsers = getUsers;

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
                isProvider: true
            };

            return getAllUsers(queryOptions)
                .then(function (users) {
                    vm.users = users.items;
                    vm.paginationOptions.totalCount = users.totalCount;

                    return vm.users;
                });
        }

        function activate() {
            getUsers();
        }
    }
})();