(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderMenuController', ProviderMenuController);

    ProviderMenuController.$inject = ['$mdSidenav', 'serviceProviderConstants', 'currentUserService', 'conf'];

    /* @ngInject */
    function ProviderMenuController($mdSidenav, serviceProviderConstants, currentUserService, conf) {
        var vm = this;

        vm.menuItems = serviceProviderConstants.MENU_ITEMS;
        vm.profileRoute = 'provider.profile';
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