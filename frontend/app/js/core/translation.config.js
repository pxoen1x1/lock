(function () {
    'use strict';

    angular
        .module('app.core')
        .config(translationConfig);

    translationConfig.$inject = [
        '$translateProvider',
        'defaultTranslationConstants'
    ];

    /* @ngInject */
    function translationConfig($translateProvider, defaultTranslationConstants) {
        var languageKey = 'language';
        var langCode = 'en';

        var usingLanguage = localStorage.getItem(languageKey);

        usingLanguage = angular.fromJson(usingLanguage);

        langCode = usingLanguage && usingLanguage.code ? usingLanguage.code : langCode;

        $translateProvider.translations('en', defaultTranslationConstants.EN);
        $translateProvider.preferredLanguage(langCode);
        $translateProvider.fallbackLanguage('en');
        $translateProvider.useLoader('translationService');
        $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider.useSanitizeValueStrategy('sanitize');
    }
})();