(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('coreDictionary', coreDictionary);

    coreDictionary.$inject = ['$q', 'dataCache', 'coreDataservice'];

    /* @ngInject */
    function coreDictionary($q, dataCache, coreDataservice) {
        var service = {
            getServices: getServices,
            getLanguages: getLanguages
        };

        return service;

        function getServices() {
            var cacheId = 'services';
            var cache = dataCache.get(cacheId);

            return $q.when(cache || getServicesFromHttp(cacheId))
                .then(getServicesComplete);

            function getServicesComplete(response) {

                return response.data;
            }

            function getServicesFromHttp() {
                return coreDataservice.getServices()
                    .then(function (response) {

                        return getDataFromHttpComplete(cacheId, response);
                    })
                    .catch(getDataFromHttpFailed);
            }
        }

        function getLanguages() {
            var cacheId = 'languages';
            var cache = dataCache.get(cacheId);

            return $q.when(cache || getLanguagesFromHttp(cacheId))
                .then(getLanguagesComplete);

            function getLanguagesComplete(response) {

                return response.data;
            }

            function getLanguagesFromHttp() {
                return coreDataservice.getLanguages()
                    .then(function (response) {

                        return getDataFromHttpComplete(cacheId, response);
                    })
                    .catch(getDataFromHttpFailed);
            }
        }

        function getDataFromHttpComplete(cacheId, response) {
            dataCache.put(cacheId, response);

            return response;
        }

        function getDataFromHttpFailed(error) {

            return error;
        }
    }
})();