(function () {
    'use strict';

    angular
        .module('app')
        .factory('errorService', errorService);

    errorService.$inject = ['$q'];

    /* @ngInject */
    function errorService($q) {
        CustomError.prototype = Object.create(Error.prototype);

        CustomError.prototype.reject = function () {

            return $q.reject(this);
        };

        var service = {
            CustomError: CustomError
        };

        return service;

        function CustomError(message, isShown) {
            this.name = 'CustomError';
            this.message = message || 'Error';
            this.isShown = !!isShown;

            Error.apply(this, arguments);

            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, CustomError);
            } else {
                this.stack = (new Error()).stack;
            }
        }
    }
})();



