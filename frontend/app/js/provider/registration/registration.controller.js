(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderRegistrationController', ProviderRegistrationController);

    ProviderRegistrationController.$inject = ['$q', '$state', 'coreDataservice', 'coreConstants', 'coreDictionary',
        'authService', 'serviceProviderConstants', 'citiesLoader', 'geocoderService'];

    /* @ngInject */
    function ProviderRegistrationController($q, $state, coreDataservice, coreConstants, coreDictionary,
                                            authService, serviceProviderConstants, citiesLoader, geocoderService) {
        var promises = {
            getState: null
        };

        var vm = this;

        vm.user = {
            user: {
                details: {
                    servicePrices: []
                }
            }
        };

        vm.searchCity = '';
        vm.states = [];
        vm.cities = [];
        vm.languages = [];
        vm.serviceTypes = [];
        vm.procedures = [];

        vm.datePickerOptions = {
            maxDate: new Date()
        };
        vm.timePickerOptions = coreConstants.MD_PICKERS_OPTIONS.timePicker;
        vm.registrationSteps = serviceProviderConstants.REGISTRATION_STEPS;
        vm.validSteps = {};
        vm.currentStep = 0;

        vm.getCities = getCities;
        vm.resetSelectedCity = resetSelectedCity;
        vm.goToNextStep = goToNextStep;
        vm.goToPrevStep = goToPrevStep;
        vm.goToStep = goToStep;
        vm.createNewUser = createNewUser;

        activate();

        function getLanguages() {

            return coreDictionary.getLanguages()
                .then(function (languages) {
                    vm.languages = languages.languages;

                    return vm.languages;
                });
        }

        function getServiceTypes() {

            return coreDictionary.getServiceTypes()
                .then(function (serviceTypes) {
                    vm.serviceTypes = serviceTypes.serviceTypes;

                    return vm.serviceTypes;
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

            return citiesLoader.getCities(state, query)
                .then(function (cities) {
                    vm.cities = cities;

                    return vm.cities;
                });
        }

        function resetSelectedCity() {
            vm.user.user.address.city = null;
            vm.searchCity = '';

            citiesLoader.resetSelectedCity();
        }

        function createUser(user) {

            return authService.register(user)
                .then(function () {

                    $state.go('home');
                });
        }

        function goToNextStep(isStepValid) {
            vm.validSteps[vm.currentStep] = isStepValid;

            vm.currentStep++;
        }

        function goToPrevStep(isStepValid) {
            vm.validSteps[vm.currentStep] = isStepValid;

            vm.currentStep--;
        }

        function goToStep(indexStep, isStepValid) {
            vm.validSteps[vm.currentStep] = isStepValid;

            vm.currentStep = indexStep;
        }

        function createNewUser(user, isFormValid) {
            if (!isFormValid) {

                return;
            }

            getAddressLocation(user.user.address)
                .then(function (location) {
                    user.user.details.location = location;
                })
                .finally(function () {
                    user.user.details.servicePrices = clearEmptyElements(user.user.details.servicePrices);

                    createUser(user);
                });
        }

        function getAddressLocation(selectedAddress) {
            if (!selectedAddress.city || !selectedAddress.address) {

                return;
            }

            var address = selectedAddress.address + ', ' +
                selectedAddress.city.city + ', ' +
                selectedAddress.state.state;

            return geocoderService.getCoordinates(address)
                .then(function (location) {
                    var resultLocation = {};

                    resultLocation.latitude = location.lat();
                    resultLocation.longitude = location.lng();
                    resultLocation.address = address;

                    return resultLocation;
                });
        }

        function clearEmptyElements(arr) {
            arr = arr.filter(function (el) {
                var isEmpty = true;

                angular.forEach(el, function (value) {
                    isEmpty = value === '' || value === null;
                });

                return !isEmpty;
            });

            return arr;
        }

        function activate() {
            $q.all([
                getLanguages(),
                getServiceTypes(),
                getStates()
            ])
                .then(function () {
                    vm.user.user.details.servicePrices.push({});
                });
        }
    }
})();