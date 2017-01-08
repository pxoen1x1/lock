(function () {
    'use strict';

    angular
        .module('app')
        .directive('menuToggle', menuToggle);

    function menuToggle() {
        var directive = {
            bindToController: true,
            controller: MenuToggleController,
            controllerAs: 'vm',
            templateUrl: 'directives/menu-toggle/menu-toggle.html',
            restrict: 'E',
            scope: true
        };

        return directive;
    }

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

