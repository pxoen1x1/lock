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
        var langCode = 'en';

        var usingLanguage = localStorage.getItem(languageKey);

        usingLanguage = angular.fromJson(usingLanguage);

        langCode = usingLanguage && usingLanguage.code ? usingLanguage.code : langCode;

        $translateProvider
            .preferredLanguage(langCode);

        $translateProvider
            .useLoader('translationService');

        $translateProvider.useMissingTranslationHandlerLog();

        $translateProvider.useSanitizeValueStrategy('sanitize');
    }
})();