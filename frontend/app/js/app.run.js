(function () {
    'use strict';

    angular
        .module('app')
        .run(runApp);

    runApp.$inject = ['$rootScope', 'cfpLoadingBar'];

    /* @ngInject */
    function runApp($rootScope, cfpLoadingBar) {
        $rootScope.$on('$stateChangeStart', function () {
            cfpLoadingBar.start();
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