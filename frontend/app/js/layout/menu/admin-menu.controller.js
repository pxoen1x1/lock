(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('AdminMenuController', AdminMenuController);

    AdminMenuController.$inject = ['$mdSidenav', 'adminConstants', 'currentUserService', 'conf'];

    /* @ngInject */
    function AdminMenuController($mdSidenav, adminConstants, currentUserService, conf) {
        var vm = this;

        vm.menuItems = adminConstants.MENU_ITEMS;
        vm.profileRoute = 'admin.profile';
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