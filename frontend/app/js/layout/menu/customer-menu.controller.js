(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerMenuController', CustomerMenuController);

    CustomerMenuController.$inject = ['$mdSidenav', 'customerConstants', 'currentUserService', 'conf'];

    /* @ngInject */
    function CustomerMenuController($mdSidenav, customerConstants, currentUserService, conf) {
        var vm = this;
        
        vm.menuItems = customerConstants.MENU_ITEMS;
        vm.baseUrl = conf.baseUrl;
        vm.profileRoute = 'customer.profile';
        vm.toggleMenu = toggleMenu;

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