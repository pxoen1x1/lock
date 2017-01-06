(function(){
    'use strict';

    angular
        .module('app.core')
        .config(['$translateProvider', function ($translateProvider) {

            var translations = {

            };

            $translateProvider
                .translations('en', translations)
                .preferredLanguage('en');
        }]);
})();
