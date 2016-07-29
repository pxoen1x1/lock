(function () {
    'use strict';

    angular
        .module('app.core')
        .config(mapConfig);

    mapConfig.$inject = ['uiGmapGoogleMapApiProvider'];

    /* @ngInject */
    function mapConfig(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyChAx8wUXND6tkUP2SLlXD32uZYw8HS1vg',
            //v: '3',
            libraries: 'weather,geometry,visualization'
        });
    }
})();