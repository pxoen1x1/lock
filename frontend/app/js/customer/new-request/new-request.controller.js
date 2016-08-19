(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerNewRequestController', CustomerNewRequestController);

    CustomerNewRequestController.$inject = ['$q', '$state', 'citiesLoader', 'geocoderService',
        'coreDataservice', 'coreDictionary', 'customerDataservice'];

    /* @ngInject */
    function CustomerNewRequestController($q, $state, citiesLoader, geocoderService,
                                          coreDataservice, coreDictionary, customerDataservice) {
        var promises = {
            getStates: null
        };

        var vm = this;

        vm.request = {};
        vm.request.location = {};

        vm.address = {};

        vm.services = [];
        vm.languages = [];
        vm.states = [];
        vm.cities = [];

        vm.isEmergency = null;
        vm.isLocationSetManually = null;
        vm.isLocationFound = false;
        vm.searchCity = '';

        vm.getCities = getCities;
        vm.resetSelectedCity = resetSelectedCity;
        vm.getAddressLocation = getAddressLocation;
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

        function getAddressLocation(selectedAddress) {
            if (!selectedAddress || Object.keys(selectedAddress).length === 0) {

                return geocoderService.getCurrentCoordinates()
                    .then(function (coordinates) {
                        vm.isLocationFound = true;

                        vm.request.location.latitude = coordinates.latitude;
                        vm.request.location.longitude = coordinates.longitude;

                        return geocoderService.getLocation(coordinates.latitude, coordinates.longitude);
                    })
                    .then(function (location) {
                        vm.request.location.address = location;

                        return vm.request;
                    })
                    .catch(function () {
                        vm.isLocationFound = false;
                    });
            }

            if (!selectedAddress.city || !selectedAddress.address) {

                return;
            }

            var address = selectedAddress.address + ', ' +
                selectedAddress.city.city + ', ' +
                selectedAddress.state.state;

            return geocoderService.getCoordinates(address)
                .then(function (location) {
                    vm.isLocationFound = true;

                    vm.request.location.latitude = location.lat();
                    vm.request.location.longitude = location.lng();
                    vm.request.location.address = vm.address.address + ', ' +
                        vm.address.city.city + ', ' +
                        vm.address.state.state;
                })
                .catch(function () {
                    vm.isLocationFound = false;
                });
        }

        function createNewRequest(request) {
            var params = {
                request: request
            };

            return customerDataservice.createRequest(params)
                .then(function (createdRequest) {

                    return createdRequest.request;
                });
        }

        function createRequest(request, isFormValid) {
            if (!isFormValid || !vm.isLocationFound) {

                return;
            }

            return createNewRequest(request)
                .then(function () {
                    $state.go('customer.requests');
                });
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