(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderRegistrationController', ProviderRegistrationController);

    ProviderRegistrationController.$inject = ['$q', '$state', 'coreDataservice', 'coreConstants',
        'serviceProviderConstant', 'serviceProviderDataservice'];

    /* @ngInject */
    function ProviderRegistrationController($q, $state, coreDataservice, coreConstants,
                                            serviceProviderConstant, serviceProviderDataservice) {
        var getLanguagesPromise;
        var getServicesPromise;
        var getProceduresPromise;
        var getStatesPromise;
        var getCitiesPromise;

        var getCityRequestOptions = {
            page: 1,
            previousQuery: '',
            isAllCitiesLoaded: false
        };

        var vm = this;

        vm.user = {};

        vm.searchCity = '';
        vm.statesList = [];
        vm.citiesList = [];
        vm.languagesList = [];
        vm.servicesList = [];
        vm.proceduresList = [];

        vm.datePickerOptions = {
            maxDate: new Date()
        };
        vm.timePickerOptions = coreConstants.MD_PICKERS_OPTIONS.timePicker;
        vm.registrationSteps = serviceProviderConstant.REGISTRATION_STEPS;
        vm.validSteps = {};
        vm.currentStep = 0;

        vm.getProceduresList = getProceduresList;
        vm.getCitiesList = getCitiesList;
        vm.resetSelectedCity = resetSelectedCity;
        vm.goToNextStep = goToNextStep;
        vm.goToPrevStep = goToPrevStep;
        vm.goToStep = goToStep;
        vm.createNewUser = createNewUser;

        activate();

        function getLanguages() {
            if (getLanguagesPromise) {
                getLanguagesPromise.cancel();
            }

            getLanguagesPromise = coreDataservice.getLanguages();

            return getLanguagesPromise
                .then(function (response) {

                    return response.data.languages;
                });
        }

        function getLanguagesList() {

            return getLanguages()
                .then(function (languages) {
                    vm.languagesList = languages;

                    return vm.languagesList;
                });
        }

        function getServices() {
            if (getServicesPromise) {
                getServicesPromise.cancel();
            }

            getServicesPromise = serviceProviderDataservice.getServices();

            return getServicesPromise
                .then(function (response) {

                    return response.data.services;
                });
        }

        function getServicesList() {

            return getServices()
                .then(function (services) {
                    vm.servicesList = services;

                    return vm.servicesList;
                });
        }

        function getProcedures(params) {
            if (getProceduresPromise) {
                getProceduresPromise.cancel();
            }

            getProceduresPromise = serviceProviderDataservice.getProcedures(params);

            return getProceduresPromise
                .then(
                    function (response) {

                        return response.data.procedures;
                    }
                );
        }

        function getProceduresList(servicesIds) {
            var params = {
                services: servicesIds
            };

            return getProcedures(params)
                .then(function (procedures) {
                    vm.proceduresList = procedures;

                    return vm.proceduresList;
                });
        }

        function getStates() {
            if (getStatesPromise) {
                getStatesPromise.cancel();
            }

            getStatesPromise = coreDataservice.getStates();

            return getStatesPromise
                .then(function (response) {

                    return response.data.states;
                });
        }

        function getStatesList() {

            return getStates()
                .then(
                    function (states) {
                        vm.statesList = states;

                        return vm.statesList;
                    }
                );
        }

        function getCities(state, params) {
            if (getCitiesPromise) {
                getCitiesPromise.cancel();
            }

            getCitiesPromise = coreDataservice.getCities(state, params);

            return getCitiesPromise
                .then(function (response) {

                    return response.data;
                });
        }

        function getCitiesList(state, query) {
            if (!state || (query && query.length < 2)) {

                return;
            }

            if (query !== getCityRequestOptions.previousQuery) {
                resetSelectedCity();
            }

            if (getCityRequestOptions.isAllCitiesLoaded) {

                return;
            }

            var params = {
                page: getCityRequestOptions.page,
                query: query
            };

            return getCities(state, params)
                .then(function (cities) {
                    vm.citiesList = vm.citiesList.concat(cities.items);

                    getCityRequestOptions.page++;
                    getCityRequestOptions.previousQuery = query;
                    getCityRequestOptions.isAllCitiesLoaded = vm.citiesList.length >= cities.totalCount;

                    return vm.citiesList;
                });
        }

        function resetSelectedCity(selectedState) {
            if (selectedState) {
                vm.user.address.city = null;
                vm.searchCity = '';
                getCityRequestOptions.previousQuery = '';

            }

            vm.citiesList = [];
            getCityRequestOptions.page = 1;
            getCityRequestOptions.isAllCitiesLoaded = false;
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
                getLanguagesList(),
                getServicesList(),
                getStatesList()
            ]);
        }
    }
})();