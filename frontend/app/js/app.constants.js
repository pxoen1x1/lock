(function () {
    'use strict';

    angular
        .module('app')
        .constant('conf', {
            BASE_URL: 'http://localhost:1338',
            URL_PREFIX: '/api/'
        });
})(); 