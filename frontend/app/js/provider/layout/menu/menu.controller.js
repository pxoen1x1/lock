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
            photo: 'https://s-media-cache-ak0.pinimg.com/736x/38/fd/d2/38fdd224b7674128ae34ed9138fa730f.jpg',
            name: 'Tony Stark',
            verified: 1,
            email: 'tony@stark.com'
        };

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }
        
    }
})();