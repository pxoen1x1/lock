(function () {
    'use strict';

    var menuToggleConfig = {
        controller: MenuToggleController,
        controllerAs: 'vm',
        templateUrl: 'directives/menu-toggle/menu-toggle.html',
        restrict: true
    };

    angular
        .module('app')
        .component('menuToggle', menuToggleConfig);

    MenuToggleController.$inject = ['$mdSidenav'];

    /* @ngInject */
    function MenuToggleController($mdSidenav) {
        var vm = this;

        vm.openMenu = openMenu;

        function openMenu() {
            $mdSidenav('left').open();
        }
    }

})();

