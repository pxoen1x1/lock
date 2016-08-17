(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerHeaderController', CustomerHeaderController);

    CustomerHeaderController.$inject = ['$rootScope', '$state', '$mdSidenav'];

    /* @ngInject */
    function CustomerHeaderController($rootScope, $state, $mdSidenav) {
        var vm = this;

        vm.headerPath = [];
        vm.title = '';
        vm.toggleMenu = toggleMenu;

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        $rootScope.$on('$stateChangeStart', function (fromState, toState, fromParams, toParams) {
            var state = toState;
            vm.headerPath = [];
            while (state.parent) {
                if (state.data.title) {
                    vm.headerPath.unshift(state.data.title);
                }
                state = $state.get(state.parent);
            }
            return vm.headerPath;
        });

    }
})();