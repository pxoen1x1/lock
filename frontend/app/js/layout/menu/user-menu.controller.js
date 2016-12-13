(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('UserMenuController', UserMenuController);

    UserMenuController.$inject = [
        '$mdSidenav',
        'serviceProviderConstants',
        'customerConstants',
        'coreConstants',
        'currentUserService',
        'conf'
        ];

    /* @ngInject */
    function UserMenuController($mdSidenav, serviceProviderConstants, customerConstants, coreConstants, currentUserService, conf) {
        var vm = this;

        vm.toggleMenu = toggleMenu;
        vm.menuItems = [];

        vm.profileState = '';
        
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.baseUrl = conf.BASE_URL;

        activate();

        function getUser() {

            return currentUserService.getUser()
                .then(function(user) {
                    vm.userProfile = user;
                    
                    return vm.userProfile;
                });
        }

        function getUserType() {
            return currentUserService.getType()
                .then(function(userType) {

                    return userType;
                });
        }

        function setMenuType(type) {
            /* 1 - client, 2 - specialist */
            if (type === coreConstants.USER_TYPES.SPECIALIST) {
                vm.menuItems = serviceProviderConstants.MENU_ITEMS;
                vm.profileState = 'provider.profile';
            } else {
                vm.menuItems = customerConstants.MENU_ITEMS;
                vm.profileState = 'customer.profile';
            }
        }

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        function activate() {
            getUser()
                .then(function() {

                    return getUserType();
                })
                .then(function(userType) {
                    setMenuType(userType);
                });
        }
    }
})();