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

        $rootScope.$on('$stateChangeSuccess', function () {
            cfpLoadingBar.complete();
        });
    }
})();