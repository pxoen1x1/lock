(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderRegistrationController', ProviderRegistrationController);

    ProviderRegistrationController.$inject = ['$state', 'coreDataservice', 'coreConstants',
        'specialistProviderConstant'];

    /* @ngInject */
    function ProviderRegistrationController($state, coreDataservice, coreConstants,
                                            specialistProviderConstant) {
        var vm = this;

        vm.user = {};

        vm.serviceTypes = [];
        vm.serviceProcedures = [];

        vm.datePickerOptions = {
            maxDate: new Date()
        };
        vm.timePickerOptions = coreConstants.MD_PICKERS_OPTIONS.timePicker;
        vm.registrationSteps = specialistProviderConstant.REGISTRATION_STEPS;
        vm.validSteps = {};
        vm.currentStep = 0;

        vm.goToNextStep = goToNextStep;
        vm.goToPrevStep = goToPrevStep;
        vm.goToStep = goToStep;
        vm.createNewUser = createNewUser;

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
    }
})();