(function () {
    'use strict';

    angular
        .module('app')
        .config(appConfig)
        .config(mapConfig);

    appConfig.$inject = ['$locationProvider', 'cfpLoadingBarProvider'];
    mapConfig.$inject = ['uiGmapGoogleMapApiProvider'];

    /* @ngInject */
    function appConfig($locationProvider, cfpLoadingBarProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        cfpLoadingBarProvider.includeSpinner = false;
        //cfpLoadingBarProvider.latencyThreshold = 100;
    }

    function mapConfig(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyChAx8wUXND6tkUP2SLlXD32uZYw8HS1vg',
            //v: '3',
            libraries: 'weather,geometry,visualization'
        });
    }
})();