(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderRegistrationController', ProviderRegistrationController);

    ProviderRegistrationController.$inject = ['specialistProviderConstant'];

    /* @ngInject */
    function ProviderRegistrationController(specialistProviderConstant) {
        var vm = this;

        vm.user = {};


        vm.user.ssn=211231231;
        vm.user.phoneNumber = 12345678901;
        vm.user.email='asd@dsf.df';
        vm.serviceTypes = [
            {
                id: 1,
                name: 'Car'
            },
            {
                id: 2,
                name: 'Residential'
            },
            {
                id:3,
                name: 'Commercial'
            }
        ];
        vm.serviceProcedures = [
            {
                display: 'First',
                value: '1'
            },
            {
                display: 'Second',
                value: '2'
            },
            {
                display: 'Third',
                value: '3'
            }
        ];
        vm.registrationSteps = specialistProviderConstant.REGISTRATION_STEPS;
        vm.validSteps = {};
        vm.currentStep = 0;

        vm.goToNextStep = goToNextStep;
        vm.goToPrevStep = goToPrevStep;
        vm.goToStep = goToStep;
        vm.createUser = createUser;
        vm.getNumber = getNumber;

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

        function createUser(user, isFormValid) {
            if (!isFormValid) {

                return;
            }

            console.log(user);
        }

        function getNumber() {

            return new Array(24);
        }

    }
})();