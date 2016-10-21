(function () {
    'use strict';

    angular
        .module('app.group')
        .controller('GroupMenuController', GroupMenuController);

    GroupMenuController.$inject = ['$mdSidenav', 'groupConstants', 'currentUserService', 'conf'];

    /* @ngInject */
    function GroupMenuController($mdSidenav, groupConstants, currentUserService, conf) {
        var vm = this;

        vm.menuItems = groupConstants.MENU_ITEMS;
        vm.baseUrl = conf.baseUrl;
        vm.profileRoute = 'group.profile';
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