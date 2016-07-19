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
        //cfpLoadingBarProvider.latencyThreshold = 1;
    }

    /* @ngInject */
    function loadingBarInit($rootScope, cfpLoadingBar) {

        $rootScope.$on('$stateChangeStart', function() {
            cfpLoadingBar.start();
        });

        $rootScope.$on('$stateChangeSuccess', function() {
        //$rootScope.$on('animEnd', function($event, element, speed) {
            cfpLoadingBar.complete();
        });
    }

})();