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

        $translateProvider.preferredLanguage(langCode);
        $translateProvider.fallbackLanguage('en');
        $translateProvider.useStaticFilesLoader({
            prefix: '/locales/locale-',
            suffix: '.json'
        });
        // $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider.useSanitizeValueStrategy('escaped');
    }
})();