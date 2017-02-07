(function () {
    'use strict';

    angular
        .module('app')
        .constant('conf', {
            BASE_URL: 'https://lockheal.com',

            EMAIL_CONFIRMED_URL: '/?emailConfirmed',
            URL_PREFIX: '/api/'
        });
})();
