(function () {
    'use strict';

    angular
        .module('app')
        .constant('conf', {
            BASE_URL: 'http://localhost:1338',
            EMAIL_CONFIRMED_URL: '/?emailConfirmed',
            URL_PREFIX: '/api/'
        });
})();
