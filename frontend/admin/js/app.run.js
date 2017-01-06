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
        'authService',
        'toastService'
    ];

    /* @ngInject */
    function runApp($rootScope, $state, $mdMedia, cfpLoadingBar, authService, toastService) {

        $rootScope.$state = $state;
        $rootScope.$mdMedia = $mdMedia;

        $rootScope.$on('$stateChangeStart', function (event, toState) {
            cfpLoadingBar.start();

            var isStatePublic = !!(toState.data && toState.data.isPublic);

            if (!authService.authorize(isStatePublic)) {
                cfpLoadingBar.complete();
                event.preventDefault();

                toastService.warning('Please log in.');

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
    }
})();