(function () {
    'use strict';

    angular
        .module('app.core')
        .config(mapConfig);

    mapConfig.$inject = ['uiGmapGoogleMapApiProvider'];

    /* @ngInject */
    function mapConfig(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyBqoLrvITR5sTXbNHaNFJsq3thbioSOks8',
            //v: '3',
            libraries: 'weather,geometry,visualization,places'
        });
    }
})();