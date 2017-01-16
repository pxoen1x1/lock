(function () {
    'use strict';

    angular
        .module('app')
        .constant('conf', {
            BASE_URL: 'http://localhost:1337',
            URL_PREFIX: '/api/'
        });
})();