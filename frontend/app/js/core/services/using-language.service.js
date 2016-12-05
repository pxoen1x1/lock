(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('usingLanguageService', usingLanguageService);

    usingLanguageService.$inject = ['$mdDialog', 'localService'];

    /* @ngInject */
    function usingLanguageService($mdDialog, localService) {
        var service = {
            getLanguage: getLanguage,
            setLanguage: setLanguage,
            removeLanguage: removeLanguage,
            isLanguageSelected: isLanguageSelected,
            showUsingLanguageModal: showUsingLanguageModal
        };

        return service;

        function getLanguage() {

            return localService.getLanguage();
        }

        function setLanguage(language) {

            return localService.setLanguage(language);
        }

        function removeLanguage() {

            return localService.removeLanguage();
        }

        function isLanguageSelected() {

            return !!getLanguage();
        }

        function showUsingLanguageModal() {
            if (isLanguageSelected()) {

                return;
            }

            return $mdDialog.show({
                controller: 'UsingLanguageModalController',
                controllerAs: 'vm',
                templateUrl: 'core/using-language-modal/using-language-modal.html',
                clickOutsideToClose: false,
                escapeToClose: false,
                hasBackdrop: true
            });
        }
    }
})();