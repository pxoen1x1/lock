(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('emailValidation', emailValidation);

    function emailValidation() {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i;

        var directive = {
            link: link,
            restrict: 'A',
            scope: {},
            require: 'ngModel',
            priority: 1
        };

        return directive;

        function link(scope, element, attrs, ngModel) {
            if (!ngModel || !ngModel.$validators.email) {
                
                return;
            }

            ngModel.$validators.email = verifyEmail;

            function verifyEmail(modelValue) {

                return ngModel.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
            }
        }
    }
})();