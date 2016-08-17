(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerHeaderController', CustomerHeaderController);

    CustomerHeaderController.$inject = ['$rootScope', '$state', '$mdSidenav'];

    /* @ngInject */
    function CustomerHeaderController($rootScope, $state, $mdSidenav) {
        var vm = this;

        vm.pageTitles = [];
        vm.toggleMenu = toggleMenu;
        
        activate();

        $rootScope.$on('$stateChangeStart', function (fromState, toState, fromParams, toParams) {
            createPageTitles(toState);
        });

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        function createPageTitles(forState) {
            var state = forState;
            vm.pageTitles = [];
            while (state.parent) {
                if (state.data.title) {
                    vm.pageTitles.unshift({
                        'title': state.data.title,
                        'state': state.name
                    });
                }
                state = $state.get(state.parent);
            }
        }

        function activate() {
            createPageTitles($state.current);
        }

    }
})();