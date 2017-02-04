(function () {
    'use strict';

    angular
        .module('app.core')
        .config(mapConfig);

    mapConfig.$inject = ['uiGmapGoogleMapApiProvider'];

    /* @ngInject */
    function mapConfig(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyDG6Y1Ic_cfCPOYON50XZsMhLuIizGycR8',
            //v: '3',
            libraries: 'weather,geometry,visualization,places'
        });
    }
})();