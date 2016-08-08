(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('dateFormatter', dateFormatter);

    dateFormatter.$inject = ['moment'];

    /* @ngInject */
    function dateFormatter(moment) {
        var directive = {
            link: link,
            require: 'ngModel',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
            ngModel.$formatters.push(function (data) {
                if (typeof data === 'string') {

                    return new Date(data);
                }

                return data;
            });

            ngModel.$parsers.push(function (date) {
                var dateFormat = attrs.dateFormatter || 'YYYY-MM-DD';

                if (!date) {

                    return null;
                }

                return moment(date).format(dateFormat);
            });
        }
    }
})();