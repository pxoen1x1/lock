(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('UserHeaderController', UserHeaderController);

    UserHeaderController.$inject = ['$rootScope', '$state', '$mdSidenav', 'authService'];

    /* @ngInject */
    function UserHeaderController($rootScope, $state, $mdSidenav, authService) {
        var vm = this;

        vm.pageTitles = [];

        vm.toggleMenu = toggleMenu;
        vm.goBack = goBack;
        vm.isAuthenticated = authService.isAuthenticated;

        activate();

        $rootScope.$on('$stateChangeStart', function (fromState, toState) {
            vm.pageTitles = createPageTitles(toState);
        });

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        function createPageTitles(state) {
            var pageTitles = [];

            if (!state.parent) {
                return vm.pageTitles;
            }
            
            while (state.parent) {
                if (state.data && state.data.title) {
                    pageTitles.unshift({
                        'title': state.data.title,
                        'url': $state.href(state.name)
                    });
                }
                state = $state.get(state.parent);
            }

            return pageTitles;
        }

        function goBack () {
            history.back();
        }

        function activate() {
            vm.pageTitles = createPageTitles($state.current);
        }

    }
})();