(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderMenuController', ProviderMenuController);

    ProviderMenuController.$inject = ['$mdSidenav', 'serviceProviderConstants'];

    /* @ngInject */
    function ProviderMenuController($mdSidenav, serviceProviderConstants) {
        var vm = this;

        vm.menuItems = serviceProviderConstants.MENU_ITEMS;
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