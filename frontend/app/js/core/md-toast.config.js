(function () {
    'use strict';

    angular
        .module('app.core')
        .config(mdToastConfig);

    mdToastConfig.$inject = ['$mdThemingProvider'];

    /* @ngInject */
    function mdToastConfig($mdThemingProvider) {
        $mdThemingProvider.theme('success-toast')
            .primaryPalette('green');

        $mdThemingProvider.theme('warning-toast')
            .primaryPalette('amber');

        $mdThemingProvider.theme('error-toast')
            .primaryPalette('red');
    }
})();