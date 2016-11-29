(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('UserMenuController', UserMenuController);

    UserMenuController.$inject = ['$mdSidenav', 'serviceProviderConstants', 'customerConstants', 'currentUserService', 'conf'];

    /* @ngInject */
    function UserMenuController($mdSidenav, serviceProviderConstants, customerConstants, currentUserService, conf) {
        var vm = this;

        vm.toggleMenu = toggleMenu;
    
        /* 1 - client, 2 - specialist */
         if (currentUserService.userType === 1) { 
             vm.menuItems = customerConstants.MENU_ITEMS;
             vm.profileRoute = 'customer.profile';

         } else if (currentUserService.userType === 2) {
             vm.menuItems = serviceProviderConstants.MENU_ITEMS;
             vm.profileRoute = 'provider.profile';
         }

        currentUserService.getUser()
            .then(function (user) {

                vm.profileData = user;
                vm.profileData.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';

                return vm.profileData;
            });

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }
        
    }
})();