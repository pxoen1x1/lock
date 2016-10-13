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
            var promises = {
                getAvailabilityInfo: null
            };

            ngModel.$asyncValidators.availability = verifyAvailability;

            function verifyAvailability(modelValue) {
                if (ngModel.$valid || (Object.keys(ngModel.$error).length === 1 && ngModel.$error.availability)) {
                    var field = {};

                    field[attrs.name] = modelValue;

                    if (promises.getAvailabilityInfo) {
                        promises.getAvailabilityInfo.cancel();
                    }

                    promises.getAvailabilityInfo = coreDataservice.getAvailabilityInfo(field);

                    return promises.getAvailabilityInfo
                        .then(function (response) {
                            if (response.data[attrs.name]) {

                                return $q.reject();
                            }

                            return true;
                        });
                }

                return true;
            }
        }
    }
})();