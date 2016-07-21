(function () {
    'use strict';
    angular
        .module('app.core')
        .config(mdDialogConfig);

    mdDialogConfig.$inject = ['$provide'];

    /* @ngInject */
    function mdDialogConfig($provide) {
        $provide.decorator('$mdDialog', function ($delegate) {
            var defaultOptions = {
                clickOutsideToClose: true,
                hasBackdrop: false,
                fullscreen: true
            };

            var methodHandle = $delegate.show;

            function decorateDialogShow() {
                var args = angular.extend({}, arguments[0], defaultOptions);

                return methodHandle(args);
            }

            $delegate.show = decorateDialogShow;

            return $delegate;
        });
    }
})();