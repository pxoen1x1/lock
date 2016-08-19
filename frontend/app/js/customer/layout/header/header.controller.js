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
            vm.pageTitles = createPageTitles(toState);
        });

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        function createPageTitles(state) {
            var pageTitles = [];
            
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

        function activate() {
            vm.pageTitles = createPageTitles($state.current);
        }

    }
})();