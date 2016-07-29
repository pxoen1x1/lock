(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('toastService', toastService);

    toastService.$inject = ['$mdToast'];

    /* @ngInject */
    function toastService($mdToast) {
        var defaultOptions = {
            position: 'top right',
            hideDelay: 3000
        };

        var service = {
            success: success,
            warning: warning,
            error: error
        };

        return service;

        function success(message, options) {
            options = angular.extend(defaultOptions, options);

            var toast = $mdToast.simple()
                .textContent(message)
                .position(options.position)
                .hideDelay(options.hideDelay)
                .theme('success-toast');

            $mdToast.show(toast);
        }

        function warning(message, options) {
            options = angular.extend(defaultOptions, options);

            var toast = $mdToast.simple()
                .textContent(message)
                .position(options.position)
                .hideDelay(options.hideDelay)
                .theme('warning-toast');

            $mdToast.show(toast);
        }

        function error(message, options) {
            options = angular.extend(defaultOptions, options);

            var toast = $mdToast.simple()
                .textContent(message)
                .position(options.position)
                .hideDelay(options.hideDelay)
                .theme('error-toast');

            $mdToast.show(toast);
        }
    }
})();