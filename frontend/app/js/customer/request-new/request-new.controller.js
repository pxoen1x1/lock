(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerNewRequestController', CustomerNewRequestController);

    CustomerNewRequestController.$inject = [
        '$q',
        '$state',
        'moment',
        'citiesLoader',
        'geocoderService',
        'coreDictionary',
        'customerDataservice',
        'coreConstants'
    ];

    /* @ngInject */
    function CustomerNewRequestController($q, $state, moment, citiesLoader, geocoderService,
                                          coreDictionary, customerDataservice, coreConstants) {
        var promises = {
            getStates: null
        };

        var vm = this;

        vm.request = {};
        vm.request.location = {};

        vm.address = {};

        vm.serviceTypes = [];
        vm.languages = [];
        vm.states = [];
        vm.cities = [];

        vm.isEmergency = null;
        vm.isLocationSetManually = null;
        vm.isLocationFound = false;
        vm.searchCity = '';

        vm.datePickerOptions = {
            minDate: moment().format('YYYY-MM-DD')
        };
        vm.timePickerOptions = coreConstants.MD_PICKERS_OPTIONS.timePicker;

        vm.warnings = {
            isLocationGpsWrong: false,
            isLocationManuallyWrong: false
        };

        vm.getCities = getCities;
        vm.resetSelectedCity = resetSelectedCity;
        vm.getAddressLocation = getAddressLocation;
        vm.createRequest = createRequest;

        activate();

        function getServiceTypes() {

            return coreDictionary.getServiceTypes()
                .then(function (serviceTypes) {
                    vm.serviceTypes = serviceTypes;

                    return vm.serviceTypes;
                });
        }

        function getLanguages() {

            return coreDictionary.getLanguages()
                .then(function (languages) {
                    vm.languages = languages;

                    return vm.languages;
                });
        }

        function getStates() {
            return coreDictionary.getStates()
                .then(function (response) {
                    vm.states = response.states;

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
                        vm.isLocationSetManually = true;
                        vm.warnings.isLocationGpsWrong = true;
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
                    vm.request.location.address = address;

                    vm.warnings.isLocationManuallyWrong = false;
                })
                .catch(function () {
                    vm.isLocationFound = false;
                    vm.warnings.isLocationManuallyWrong = true;
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
                getServiceTypes(),
                getLanguages(),
                getStates()
            )
                .then( function() {
                    vm.request.serviceType = 1;
                });
        }
    }
})();