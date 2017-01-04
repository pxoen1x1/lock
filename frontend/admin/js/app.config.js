(function () {
    'use strict';

    angular
        .module('app')
        .config(appConfig);

    appConfig.$inject = ['$locationProvider', '$httpProvider', '$sailsProvider', 'cfpLoadingBarProvider', 'conf'];

    /* @ngInject */
    function appConfig($locationProvider, $httpProvider, $sailsProvider, cfpLoadingBarProvider, conf) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $httpProvider.interceptors.push('httpInterceptors');

        $sailsProvider.interceptors.push('httpInterceptors');
        $sailsProvider.url = conf.BASE_URL;

        cfpLoadingBarProvider.includeSpinner = false;
    }
})();