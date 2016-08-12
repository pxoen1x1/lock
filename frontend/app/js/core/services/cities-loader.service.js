(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('citiesLoader', citiesLoader);

    citiesLoader.$inject = ['$q', 'coreDataservice'];

    /* @ngInject */
    function citiesLoader($q, coreDataservice) {
        var promises = {
            getStates: null,
            getCity: null
        };

        var getCityRequestOptions = {
            page: 1,
            previousQuery: '',
            isAllCitiesLoaded: false
        };

        var citiesList = [];

        var service = {
            getCities: getCities,
            resetSelectedCity: resetSelectedCity
        };

        return service;

        function getCitiesList(state, params) {
            if (promises.getCities) {
                promises.getCities.cancel();
            }

            promises.getCities = coreDataservice.getCities(state, params);

            return promises.getCities
                .then(function (response) {

                    return response.data;
                });
        }

        function getCities(state, query) {
            if (!state || (query && query.length < 2)) {

                return $q.resolve(citiesList);
            }

            if (query !== getCityRequestOptions.previousQuery) {
                resetSelectedCity();
            }

            if (getCityRequestOptions.isAllCitiesLoaded) {

                return $q.resolve(citiesList);
            }

            var params = {
                page: getCityRequestOptions.page,
                query: query
            };

            return getCitiesList(state, params)
                .then(function (cities) {
                    citiesList = citiesList.concat(cities.items);

                    getCityRequestOptions.page++;
                    getCityRequestOptions.previousQuery = query;
                    getCityRequestOptions.isAllCitiesLoaded = citiesList.length >= cities.totalCount;

                    return citiesList;
                })
                .catch(function (err) {

                    return err;
                });
        }

        function resetSelectedCity() {
            citiesList = [];
            getCityRequestOptions.page = 1;
            getCityRequestOptions.isAllCitiesLoaded = false;
        }
    }
})();

