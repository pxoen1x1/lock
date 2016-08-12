(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataCache', dataCache);

    dataCache.$inject = ['$cacheFactory'];

    /* @ngInject */
    function dataCache($cacheFactory) {

        return $cacheFactory('dataCache', {});
    }
})();