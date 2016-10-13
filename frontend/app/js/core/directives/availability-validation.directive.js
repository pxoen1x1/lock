(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('availabilityValidation', availabilityValidation);

    function availabilityValidation(coreDataservice, $q) {

        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel',
            priority: 5
        };

        return directive;

        function link(scope, element, attrs, ngModel) {

            ngModel.$asyncValidators.availability = verifyAvailability;

            function verifyAvailability(modelValue) {
                if (ngModel.$valid || (Object.keys(ngModel.$error).length === 1 && ngModel.$error.availability)) {
                    var field = {};
                    field[attrs.name] = modelValue;
                    return coreDataservice.getAvailabilityInfo(field)
                        .then(function (response) {
                            if (response.data[attrs.name]) {
                                return $q.reject();
                            } else {
                                return $q.resolve();
                            }
                        });
                } else {
                    return $q.resolve();
                }
            }
        }
    }
})();