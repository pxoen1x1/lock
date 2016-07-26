(function () {
    'use strict';

    angular
        .module('app')
        .run(runApp);

    runApp.$inject = ['$rootScope', 'cfpLoadingBar', '$mdDialog'];

    /* @ngInject */
    function runApp($rootScope, cfpLoadingBar, $mdDialog) {
        $rootScope.$on('$stateChangeStart', function (event, toStart) {
            cfpLoadingBar.start();

            if (toStart.name === 'login') {
                cfpLoadingBar.complete();
                event.preventDefault();

                $mdDialog.show({
                    templateUrl: 'core/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm'
                });
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