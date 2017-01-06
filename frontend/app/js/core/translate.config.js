(function(){
    'use strict';

    angular
        .module('app.core', ['pascalprecht.translate'])
        .config(['$translateProvider', function ($translateProvider) {

            var translations = {

            };

            $translateProvider
                .translations('en', translations)
                .preferredLanguage('en');
        }]);
})();