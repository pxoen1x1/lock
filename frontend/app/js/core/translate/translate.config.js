(function(){
    'use strict';

    angular
        .module('app.core')
        .config(['$translateProvider', translateProviderConfig]);

    translateProviderConfig.$inject = [
        '$translateProvider',
        'localService'
    ];

    /* @ngInject */
    function translateProviderConfig($translateProvider, localService) {

        var translations_EN = {
            PROFILE: 'Profile'
        };

        $translateProvider
            .translations('en', translations_EN)
            .preferredLanguage('en');
    }
})();
