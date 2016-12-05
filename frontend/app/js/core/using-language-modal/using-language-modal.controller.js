(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('UsingLanguageModalController', UsingLanguageModalController);

    UsingLanguageModalController.$inject = ['$mdDialog', 'usingLanguageService', 'coreDictionary', 'coreConstants'];

    /* @ngInject */
    function UsingLanguageModalController($mdDialog, usingLanguageService, coreDictionary, coreConstants) {
        var vm = this;

        vm.selectedLanguage = null;
        vm.languages = [];

        vm.setLanguage = setLanguage;

        activate();

        function getLanguages() {

            return coreDictionary.getLanguages()
                .then(function (languages) {
                    vm.languages = languages;

                    return vm.languages;
                });
        }

        function setLanguage(language, isFormValid) {
            if (!isFormValid) {

                return;
            }

            usingLanguageService.setLanguage(language);

            $mdDialog.hide(language);
        }

        function setDefaultLanguage(languages) {
            var defaultLanguage = null;

            languages.forEach(function (language) {
                if (language.name.toLowerCase() === coreConstants.DEFAULT_LANGUAGE.name.toLowerCase()) {
                    defaultLanguage = language;
                }
            });

            vm.selectedLanguage = defaultLanguage;
        }

        function activate() {
            getLanguages()
                .then(setDefaultLanguage);
        }
    }
})();