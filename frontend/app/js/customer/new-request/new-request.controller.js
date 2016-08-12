(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('NewRequestController', NewRequestController);

    NewRequestController.$inject = ['$q', 'coreDataservice', 'coreDictionary', 'citiesLoader'];

    /* @ngInject */
    function NewRequestController($q, coreDataservice, coreDictionary, citiesLoader) {
        var promises = {
            getStates: null
        };

        var vm = this;

        vm.request = {};

        vm.address = {};

        vm.services = [];
        vm.languages = [];
        vm.states = [];
        vm.cities = [];

        vm.isEmergency = null;
        vm.isLocationSetManually = null;
        vm.searchCity = '';

        vm.getCities = getCities;
        vm.resetSelectedCity = resetSelectedCity;
        vm.createRequest = createRequest;

        activate();

        function getServices() {

            return coreDictionary.getServices()
                .then(function (services) {
                    vm.services = services.services;

                    return vm.services;
                });
        }

        function getLanguages() {

            return coreDictionary.getLanguages()
                .then(function (languages) {
                    vm.languages = languages.languages;

                    return vm.languages;
                });
        }

        function getStates() {
            if (promises.getStates) {
                promises.getStates.cancel();
            }

            promises.getStates = coreDataservice.getStates();

            return promises.getStates
                .then(function (response) {
                    vm.states = response.data.states;

                    return vm.states;
                });
        }

        function getCities(state, query) {

            return citiesLoader.getCities(state.id, query)
                .then(function (cities) {
                    vm.cities = cities;

                    return vm.cities;
                });
        }

        function resetSelectedCity() {
            vm.address.city = null;
            vm.searchCity = '';

            citiesLoader.resetSelectedCity();
        }

        function createRequest(request, isFormValid) {
            if (!isFormValid) {

                return;
            }
        }

        function activate() {
            $q.all(
                getServices(),
                getLanguages(),
                getStates()
            );
        }
    }
})();