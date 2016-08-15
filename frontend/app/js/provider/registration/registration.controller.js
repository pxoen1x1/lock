(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderRegistrationController', ProviderRegistrationController);

    ProviderRegistrationController.$inject = ['$q', '$state', 'coreDataservice', 'coreConstants', 'coreDictionary',
        'serviceProviderConstant', 'serviceProviderDataservice', 'citiesLoader'];

    /* @ngInject */
    function ProviderRegistrationController($q, $state, coreDataservice, coreConstants, coreDictionary,
                                            serviceProviderConstant, serviceProviderDataservice, citiesLoader) {
        var promises = {
            getState: null,
            getProcedures: null
        };

        var vm = this;

        vm.user = {};
        vm.user.details = {};
        vm.user.details.servicePrices = [];

        vm.searchCity = '';
        vm.states = [];
        vm.cities = [];
        vm.languages = [];
        vm.services = [];
        vm.procedures = [];

        vm.datePickerOptions = {
            maxDate: new Date()
        };
        vm.timePickerOptions = coreConstants.MD_PICKERS_OPTIONS.timePicker;
        vm.registrationSteps = serviceProviderConstant.REGISTRATION_STEPS;
        vm.validSteps = {};
        vm.currentStep = 0;

        vm.getProcedures = getProcedures;
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

        function getServices() {

            return coreDictionary.getServices()
                .then(function (services) {
                    vm.services = services.services;

                    return vm.services;
                });
        }

        function getProceduresList(params) {
            if (promises.getProcedures) {
                promises.getProcedures.cancel();
            }

            promises.getProcedures = serviceProviderDataservice.getProcedures(params);

            return promises.getProcedures
                .then(
                    function (response) {

                        return response.data.procedures;
                    }
                );
        }

        function getProcedures(servicesIds) {
            var params = {
                services: servicesIds
            };

            return getProceduresList(params)
                .then(function (procedures) {
                    vm.procedures = procedures;

                    return vm.procedures;
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
            vm.user.address.city = null;
            vm.searchCity = '';

            citiesLoader.resetSelectedCity();
        }

        function createUser(user) {

            return coreDataservice.createUser(user)
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

            createUser(user);
        }

        function activate() {
            $q.all([
                getLanguages(),
                getServices(),
                getStates()
            ])
                .then(function(){
                    vm.user.details.servicePrices.push({});
                });
        }
    }
})();