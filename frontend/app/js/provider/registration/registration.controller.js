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

        var vm = this;

        vm.user = {
            user: {
                details: {
                    servicePrices: []
                }
            }
        };

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
            ])
                .then(function () {
                    vm.user.user.details.servicePrices.push({});
                });
        }
    }
})();