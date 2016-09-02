(function () {
    'use strict';

    angular
        .module('app')
        .config(appConfig);

    appConfig.$inject = ['$locationProvider', '$httpProvider', 'cfpLoadingBarProvider'];

    /* @ngInject */
    function appConfig($locationProvider, $httpProvider, cfpLoadingBarProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $httpProvider.interceptors.push('httpInterceptors');

        cfpLoadingBarProvider.includeSpinner = false;
        //cfpLoadingBarProvider.latencyThreshold = 100;
    }
})();