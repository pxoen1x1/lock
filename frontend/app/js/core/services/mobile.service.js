(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('mobileService', mobileService);

    mobileService.$inject = ['$window'];

    /* @ngInject */
    function mobileService($window) {
        var service = {
            isMobileApplication: isMobileApplication,
            getImagePath: getImagePath
        };

        return service;

        function isMobileApplication() {

            return document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
        }

        function getImagePath(imagePath) {
            if (!imagePath) {

                return;
            }

            if (isMobileApplication()) {
                var appDir = $window.cordova.file.applicationDirectory;

                imagePath = appDir + 'www' + imagePath;
            }

            return imagePath;
        }
    }
})();