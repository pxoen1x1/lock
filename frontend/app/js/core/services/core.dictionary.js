(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('coreDictionary', coreDictionary);

    coreDictionary.$inject = ['$q', 'dataCache', 'coreDataservice'];

    /* @ngInject */
    function coreDictionary($q, dataCache, coreDataservice) {
        var service = {
            getServiceTypes: getServiceTypes,
            getLanguages: getLanguages,
            getStates: getStates
        };

        return service;

        function getServiceTypes() {
            var cacheId = 'serviceTypes';
            var cache = dataCache.get(cacheId);

            return $q.when(cache || getServiceTypesFromHttp(cacheId))
                .then(getServiceTypesComplete);

            function getServiceTypesComplete(response) {

                return response.serviceTypes || response.data.serviceTypes;
            }

            function getServiceTypesFromHttp(cacheId) {
                return coreDataservice.getServiceTypes()
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

                return response.languages || response.data.languages;
            }

            function getLanguagesFromHttp(cacheId) {
                return coreDataservice.getLanguages()
                    .then(function (response) {

                        return getDataFromHttpComplete(cacheId, response);
                    })
                    .catch(getDataFromHttpFailed);
            }
        }

        function getStates() {
            var cacheId = 'states';
            var cache = dataCache.get(cacheId);

            return $q.when(cache || getStatesFromHttp(cacheId))
                .then(getStatesComplete);

            function getStatesComplete(response) {

                return response;
            }

            function getStatesFromHttp(cacheId) {
                return coreDataservice.getStates()
                    .then(function (response) {

                        return getDataFromHttpComplete(cacheId, response);
                    })
                    .catch(getDataFromHttpFailed);
            }
        }

        function getDataFromHttpComplete(cacheId, response) {
            dataCache.put(cacheId, response.data);

            return response.data;
        }

        function getDataFromHttpFailed(error) {

            return error;
        }
    }
})();