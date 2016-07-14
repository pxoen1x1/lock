(function () {
    'use strict';

    angular
        .module('app')
        .config(appConfig)
        .config(loadingBarConfig)
        .run(loadingBarInit);

    appConfig.$inject = ['$locationProvider'];
    loadingBarInit.$inject = ['$rootScope', 'cfpLoadingBar'];
    loadingBarConfig.$inject = ['cfpLoadingBarProvider'];

    /* @ngInject */
    function appConfig($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }

    /* @ngInject */
    function loadingBarConfig(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        //cfpLoadingBarProvider.latencyThreshold = 100;
    }

    /* @ngInject */
    function loadingBarInit($rootScope, cfpLoadingBar) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            cfpLoadingBar.start();
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            cfpLoadingBar.complete();
        });
    }

})();