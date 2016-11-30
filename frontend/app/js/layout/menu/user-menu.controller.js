(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('UserMenuController', UserMenuController);

    UserMenuController.$inject = ['$mdSidenav', 'serviceProviderConstants', 'customerConstants', 'coreConstants', 'currentUserService', 'conf'];

    /* @ngInject */
    function UserMenuController($mdSidenav, serviceProviderConstants, customerConstants, coreConstants, currentUserService, conf) {
        var vm = this;

        vm.toggleMenu = toggleMenu;
        vm.menuItems = [];
        vm.profileRoute = '';

        currentUserService.getType()
            .then(function(type) {
                return setMenuType(type);
            })
            .catch(function(e) {
                console.log(e);
            });

        currentUserService.getUser()
            .then(function (user) {

                vm.profileData = user;
                vm.profileData.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';

                return vm.profileData;
            });



        function setMenuType(type) {
            
            /* 1 - client, 2 - specialist */
            if (type === coreConstants.USER_TYPES.SPECIALIST) {
                vm.menuItems = serviceProviderConstants.MENU_ITEMS;
                vm.profileRoute = 'provider.profile';
            } else {
                vm.menuItems = customerConstants.MENU_ITEMS;
                vm.profileRoute = 'customer.profile';
            }
        }

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }
        
    }
})();