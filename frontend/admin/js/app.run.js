(function () {
    'use strict';

    angular
        .module('app')
        .run(runApp);

    runApp.$inject = [
        '$rootScope',
        '$state',
        '$mdMedia',
        'cfpLoadingBar',
        'authService'
    ];

    /* @ngInject */
    function runApp($rootScope, $state, $mdMedia, cfpLoadingBar, authService) {

        $rootScope.$state = $state;
        $rootScope.$mdMedia = $mdMedia;


        $rootScope.$on('$stateChangeStart', function (event, toState) {
            cfpLoadingBar.start();

            $rootScope.MENU_ITEMS = getMenuItems();

            var isStatePublic = !!(toState.data && toState.data.isPublic);

            if (!authService.authorize(isStatePublic)) {
                cfpLoadingBar.complete();
                event.preventDefault();

                $state.go('login');
            }
        });

        $rootScope.$on('$stateChangeError', function () {
            cfpLoadingBar.complete();
        });
        $rootScope.$on('$viewContentLoaded', function () {
            cfpLoadingBar.complete();
        });
        $rootScope.$on('$stateNotFound', function () {
            cfpLoadingBar.complete();
        });

        function getMenuItems() {
            var menuItems = [];
            var states = $state.get();

            states.forEach(function (state) {
                if (state.data && state.data.menuItem) {
                    var menuItem = state.data.menuItem;
                    menuItem.state = state.name;
                    menuItem.title = state.data.title;

                    menuItems.push(menuItem);
                }
            });

            return menuItems;
        }
    }
})();