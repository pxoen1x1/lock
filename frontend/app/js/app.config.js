(function () {
    'use strict';

    angular
        .module('app')
        .config(appConfig);

    appConfig.$inject = ['$locationProvider', 'cfpLoadingBarProvider'];

    /* @ngInject */
    function appConfig($locationProvider, cfpLoadingBarProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        cfpLoadingBarProvider.includeSpinner = false;
        //cfpLoadingBarProvider.latencyThreshold = 100;
    }
})();