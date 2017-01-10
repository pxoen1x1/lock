(function () {
    'use strict';
    angular
        .module('app.core')
        .config(mdDialogConfig);

    mdDialogConfig.$inject = ['$provide'];

    /* @ngInject */
    function mdDialogConfig($provide) {
        $provide.decorator('$mdDialog', ['$delegate', function ($delegate) {
            var defaultOptions = {
                clickOutsideToClose: true,
                hasBackdrop: false
            };

            var methodHandle = $delegate.show;

            function decorateDialogShow() {
                var args = angular.extend({}, defaultOptions, arguments[0]);

                return methodHandle(args);
            }

            $delegate.show = decorateDialogShow;

            return $delegate;
        }]);
    }
})();