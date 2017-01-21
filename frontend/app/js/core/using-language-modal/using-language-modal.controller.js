(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('UsingLanguageModalController', UsingLanguageModalController);

    UsingLanguageModalController.$inject = [
        '$mdDialog',
        '$translate',
        'coreDictionary',
        'coreConstants'
    ];

    /* @ngInject */
    function UsingLanguageModalController($mdDialog, $translate, coreDictionary, coreConstants) {
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

            $translate.use(language.code);

            $mdDialog.hide(language);
        }

        function setDefaultLanguage(languages) {

            languages.forEach(function (language) {
                if (language.name.toLowerCase() === coreConstants.DEFAULT_LANGUAGE.name.toLowerCase()) {
                    vm.selectedLanguage = language;
                }
            });
        }

        function activate() {
            getLanguages()
                .then(setDefaultLanguage);
        }
    }
})();