(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerMenuController', CustomerMenuController);

    CustomerMenuController.$inject = ['$mdSidenav', 'customerConstants'];

    /* @ngInject */
    function CustomerMenuController($mdSidenav, customerConstants) {
        var vm = this;

        vm.menuItems = customerConstants.MENU_ITEMS;
        vm.toggleMenu = toggleMenu;

        vm.dataSource = {
            photo: "https://pp.vk.me/c604329/v604329073/1a33c/XhTVHpUbzGU.jpg",
            name: "Elliot Alderson",
            verified: 1,
            email: "mrrobot@fsociety.org"
        };

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }
        
    }
})();