(function () {
    'use strict';

    angular
        .module('app')
        .constant('conf', {
            BASE_URL: 'http://192.168.0.100:1338',
            URL_PREFIX: '/api/'
        });
})(); 