(function () {
    'use strict';

    angular
        .module('app')
        .run(runApp);

    runApp.$inject = [
        '$rootScope',
        '$state',
        '$mdMedia',
        'cfpLoadingBar'
    ];

    /* @ngInject */
    function runApp($rootScope, $state, $mdMedia, cfpLoadingBar) {

        $rootScope.$state = $state;
        $rootScope.$mdMedia = $mdMedia;


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