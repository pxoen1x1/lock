(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('availabilityValidation', availabilityValidation);

    availabilityValidation.$inject = ['coreDataservice', '$q'];

    /* @ngInject */
    function availabilityValidation(coreDataservice, $q) {
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel',
            priority: 5
        };

        return directive;

        function link(scope, element, attrs, ngModel) {
            var prevModelValue;
            var promises = {
                getAvailabilityInfo: null
            };

            ngModel.$asyncValidators.availability = verifyAvailability;

            function verifyAvailability(modelValue) {
                if (prevModelValue === modelValue) {

                    return ngModel.$error.availability ? $q.reject() : $q.resolve();
                }

                var field = {};

                field[attrs.name] = modelValue;
                prevModelValue = modelValue;

                if (promises.getAvailabilityInfo) {
                    promises.getAvailabilityInfo.cancel();
                }

                promises.getAvailabilityInfo = coreDataservice.getAvailabilityInfo(field);

                return promises.getAvailabilityInfo
                    .then(function (response) {
                        if (response.data[attrs.name]) {

                            return $q.reject();
                        }

                        return $q.resolve();
                    });
            }
        }
    }
})();