(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('passwordValidation', passwordValidation);

    function passwordValidation() {

        // at least one number, one letter and contain >=6 characters
        var PASS_REGEXP = /^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/;

        var directive = {
            link: link,
            restrict: 'A',
            scope: {},
            require: 'ngModel',
            priority: 1
        };

        return directive;

        function link(scope, element, attrs, ngModel) {
            ngModel.$validators.password = verifyPass;

            function verifyPass(modelValue) {

                return ngModel.$isEmpty(modelValue) || PASS_REGEXP.test(modelValue);
            }
        }
    }
})();