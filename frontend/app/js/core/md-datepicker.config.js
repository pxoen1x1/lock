(function () {
    'use strict';

    angular
        .module('app.core')
        .config(mdDatepickerConfig);

    mdDatepickerConfig.$inject = ['$mdDateLocaleProvider', 'moment'];

    /* @ngInject */
    function mdDatepickerConfig($mdDateLocaleProvider, moment) {
        $mdDateLocaleProvider.formatDate = function (date) {
            if (date) {

                return moment(date).format('MM/DD/YYYY');
            }

            return null;
        };
    }
})();