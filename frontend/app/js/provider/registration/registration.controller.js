(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderRegistrationController', ProviderRegistrationController);

    ProviderRegistrationController.$inject = ['$q', '$state', 'coreDataservice', 'coreConstants', 'coreDictionary',
        'authService', 'serviceProviderConstants'];

    /* @ngInject */
    function ProviderRegistrationController($q, $state, coreDataservice, coreConstants, coreDictionary,
                                            authService, serviceProviderConstants) {
        var promises = {
            getState: null
        };

        var vm = this;

        vm.user = {
            details: {
                licenses: [{}]
            }
        };
        vm.auth = {};

        vm.states = [];
        vm.languages = [];
        vm.serviceTypes = [];
        vm.procedures = [];

        vm.datePickerOptions = {
            minDate: new Date()
        };
        vm.timePickerOptions = coreConstants.MD_PICKERS_OPTIONS.timePicker;
        vm.registrationSteps = serviceProviderConstants.REGISTRATION_STEPS;
        vm.validSteps = {};
        vm.currentStep = 0;

        vm.goToNextStep = goToNextStep;
        vm.goToPrevStep = goToPrevStep;
        vm.goToStep = goToStep;
        vm.createNewUser = createNewUser;
        vm.addLicenseForm = addLicenseForm;
        vm.removeLicenseForm = removeLicenseForm;

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

            var params = {
                auth: vm.auth,
                user: user
            };
            
            createUser(params);
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

        function addLicenseForm() {
            vm.user.details.licenses.push({});
            return ;
        }

        function removeLicenseForm(index) {
            vm.user.details.licenses.splice(index, 1);
            return ;
        }

        function activate() {
            $q.all([
                getLanguages(),
                getServiceTypes(),
                getStates()
            ]);
        }
    }
})();