(function () {
    'use strict';

    angular
        .module('app.group')
        .controller('GroupMenuController', GroupMenuController);

    GroupMenuController.$inject = ['$mdSidenav', 'groupConstants'];

    /* @ngInject */
    function GroupMenuController($mdSidenav, groupConstants) {
        var vm = this;

        vm.menuItems = groupConstants.MENU_ITEMS;
        vm.profileRoute = 'group.profile';
        vm.toggleMenu = toggleMenu;

        vm.dataSource = {
            photo: 'http://i-deasoft.com/system/logos/1/logoTop_original.png?1461230167',
            name: 'Ideasoft',
            verified: 1,
            email: 'admin@i-deasoft.com'
        };

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

    }
})();