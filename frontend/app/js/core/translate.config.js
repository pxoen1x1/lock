(function () {
    'use strict';

    angular
        .module('app.core')
        .config(translationConfig);

    translationConfig.$inject = [
        '$translateProvider'
    ];

    /* @ngInject */
    function translationConfig($translateProvider) {
        var languageKey = 'language';
        var translationsEn = {
            'PROFILE': 'Profile'
        };

        var usingLanguage = localStorage.getItem(languageKey);
        usingLanguage = angular.fromJson(usingLanguage);

        console.log(usingLanguage.code);
        $translateProvider
            .translations('es', translationsEn);
        $translateProvider
            .preferredLanguage(usingLanguage.code);
    }
})();