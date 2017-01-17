(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('translationService', translationService);

    translationService.$inject = [
        '$q',
        'coreDataservice'
    ];

    /* @ngInject */
    function translationService($q, coreDataservice) {

        return getTranslation;

        function getTranslation(langKey) {
            if (!langKey.key) {

                return $q.reject();
            }

            try {

                return coreDataservice.getTranslation(langKey.key);

            } catch(e) {
                console.log(e);

                return;
            }
        }
    }
})();