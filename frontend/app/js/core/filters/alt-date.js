(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('altDate', altDate);

    altDate.$inject = ['moment'];

    /* @ngInject */
    function altDate(moment) {

        return altDateFilter;

        function altDateFilter(date, dateFormate) {
            var fromNow = Date.now() - new Date(date);

            if (fromNow < 3600 * 1000) {

                return moment(date).fromNow();
            }

            if (fromNow < 24 * 3600 * 1000) {

                return moment(date).format('hh:mm a');
            }

            if (fromNow < 7 * 24 * 3600 * 1000) {

                return moment(date).format('ddd hh:mm a');
            }

            return dateFormate ? moment(date).format(dateFormate) : moment(date).calendar();
        }
    }
})();