(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('UserMenuController', UserMenuController);

    UserMenuController.$inject = [
        '$mdSidenav',
        'serviceProviderConstants',
        'groupConstants',
        'customerConstants',
        'coreConstants',
        'currentUserService',
        'conf'
    ];

    /* @ngInject */
    function UserMenuController($mdSidenav, serviceProviderConstants, groupConstants, customerConstants, coreConstants,
                                currentUserService, conf) {
        var vm = this;

        vm.toggleMenu = toggleMenu;
        vm.menuItems = [];

        vm.profileState = '';

        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.baseUrl = conf.BASE_URL;

        activate();

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {
                    vm.userProfile = user;

                    return vm.userProfile;
                });
        }

        function getUserType() {
            return currentUserService.getType()
                .then(function (userType) {

                    return userType;
                });
        }

        function setMenuType(type) {
            switch (type) {
                case coreConstants.USER_TYPES.SPECIALIST:
                    vm.menuItems = serviceProviderConstants.MENU_ITEMS;
                    vm.profileState = 'provider.profile';
                    break;
                case coreConstants.USER_TYPES.GROUP_ADMIN:
                    vm.menuItems = groupConstants.MENU_ITEMS;
                    vm.profileState = 'group.profile';
                    break;
                default:
                    vm.menuItems = customerConstants.MENU_ITEMS;
                    vm.profileState = 'customer.profile';
            }
        }

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        function activate() {
            getUser()
                .then(function () {

                    return getUserType();
                })
                .then(function (userType) {
                    setMenuType(userType);
                });
        }
    }
})();