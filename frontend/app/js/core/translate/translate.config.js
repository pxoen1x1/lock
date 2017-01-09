(function(){
    'use strict';

    angular
        .module('app.core')
        .config(['$translateProvider', translateProviderConfig]);

    translateProviderConfig.$inject = [
        '$translateProvider',
        'localService',
        'translations.js'
    ];

    /* @ngInject */
    function translateProviderConfig($translateProvider, localService, translations) {

        var translations_en = {
            PROFILE: 'Profile'
        };

        $translateProvider
            .translations('en', translations_en)
            .preferredLanguage('en');
    }
})();
